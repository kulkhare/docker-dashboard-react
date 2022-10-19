/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
// Docker Manager React components

// @mui material components
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

// Images
// import team2 from "assets/images/team-2.jpg";
// import team3 from "assets/images/team-3.jpg";
// import team4 from "assets/images/team-4.jpg";
import { useEffect, useState } from "react";
import baseUrl from "constants";
import axios from "axios";

export default function data() {
  const [containers, setContainers] = useState([]);
  const [menu, setMenu] = useState(null);

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  // Using useEffect to call the API once mounted and set the data
  useEffect(() => {
    (async () => {
      const result = await axios({
        method: "get",
        url: `${baseUrl}/containers?getAll=true`,
      });
      console.log(result.data);
      setContainers(result.data);
    })();
  }, []);

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);
  const options = ["Start", "Stop", "Restart", "Pause", "Resume", "Remove", "Kill"];

  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(menu)}
      onClose={closeMenu}
    >
      {options.map((option) => (
        <MenuItem key={option} onClick={closeMenu}>
          {option}
        </MenuItem>
      ))}
    </Menu>
  );

  const rows = [];
  if (containers.length !== 0) {
    let row = {};
    containers.forEach((result) => {
      row = {
        container_id: result.Id.substring(0, 30),
        image: <Job title={result.Image.substring(0, 30)} description={result.Command} />,
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent={result.Status} color="warning" variant="gradient" size="md" />
          </MDBox>
        ),
        names: (
          <MDBox ml={-1}>
            <MDBadge badgeContent={result.Names} color="dark" variant="gradient" size="md" />
          </MDBox>
        ),
        ports: result.Ports,
        created: result.Created,
        action: (
          <MDTypography color="text">
            <Icon
              sx={{ cursor: "pointer", fontWeight: "bold" }}
              fontSize="small"
              onClick={openMenu}
            >
              more_vert
            </Icon>
            {renderMenu}
          </MDTypography>
        ),
      };
      rows.push(row);
    });
  }

  return {
    columns: [
      { Header: "container id", accessor: "container_id", width: "20%", align: "left" },
      { Header: "image", accessor: "image", align: "left" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "names", accessor: "names", align: "center" },
      { Header: "ports", accessor: "ports", align: "center" },
      { Header: "created", accessor: "created", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows,
  };
}
