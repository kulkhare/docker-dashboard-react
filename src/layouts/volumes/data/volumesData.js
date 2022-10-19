/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
// Docker Manager React components

// @mui material components
import MDBox from "components/MDBox";
import MDBadge from "components/MDBadge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Icon from "@mui/material/Icon";
import MDTypography from "components/MDTypography";
import { useEffect, useState } from "react";
import baseUrl from "constants";
import axios from "axios";

export default function data() {
  const [volumes, setVolumes] = useState([]);
  const [menu, setMenu] = useState(null);

  // Using useEffect to call the API once mounted and set the data
  useEffect(() => {
    (async () => {
      const result = await axios({
        method: "get",
        url: `${baseUrl}/volumes?getAll=true`,
      });
      console.log(result.data.Volumes);
      setVolumes(result.data.Volumes);
    })();
  }, []);

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);
  const options = ["Remove"];

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
  if (volumes.length !== 0) {
    let row = {};
    volumes.forEach((result) => {
      row = {
        driver: result.Driver.substring(0, 30),
        volume_name: result.Name.substring(0, 12),
        mount_point: (
          <MDBox ml={-1}>
            <MDBadge badgeContent={result.Mountpoint} color="dark" variant="gradient" size="md" />
          </MDBox>
        ),
        scope: result.Scope,
        created: result.CreatedAt,
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
      { Header: "driver", accessor: "driver", width: "30%", align: "left" },
      { Header: "volume name", accessor: "volume_name", align: "left" },
      { Header: "mount point", accessor: "mount_point", align: "center" },
      { Header: "scope", accessor: "scope", align: "center" },
      { Header: "created", accessor: "created", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows,
  };
}
