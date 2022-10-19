/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
// Docker Manager React components

// @mui material components
import MDBox from "components/MDBox";
// import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Icon from "@mui/material/Icon";
import MDTypography from "components/MDTypography";
import { useEffect, useState } from "react";
import baseUrl from "constants";
import axios from "axios";

export default function data() {
  const [images, setImages] = useState([]);
  const [menu, setMenu] = useState(null);

  // Using useEffect to call the API once mounted and set the data
  useEffect(() => {
    (async () => {
      const result = await axios({
        method: "get",
        url: `${baseUrl}/images?getAll=true`,
      });
      console.log(result.data);
      setImages(result.data);
    })();
  }, []);

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);
  const options = ["Build", "Remove", "History"];

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
  if (images.length !== 0) {
    let row = {};
    images.forEach((result) => {
      row = {
        repository: result.Id.substring(0, 30),
        image_id: (
          <MDBox ml={-1}>
            <MDBadge badgeContent={result.RepoTags} color="dark" variant="gradient" size="md" />
          </MDBox>
        ),
        size: result.Size,
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
      { Header: "repository", accessor: "repository", align: "left" },
      { Header: "image id", accessor: "image_id", width: "30%", align: "left" },
      { Header: "created", accessor: "created", align: "center" },
      { Header: "size", accessor: "size", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows,
  };
}
