import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import {
  List,
  ListItem,
  ListItemText,
  Collapse,
  Checkbox,
  Container,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

interface Post {
  id: number;
  title: string;
  body: string;
}


const departmentData = [
  {
    department: "customer_service",
    sub_departments: ["support", "customer_success"],
  },
  {
    department: "design",
    sub_departments: ["graphic_design", "product_design", "web_design"],
  },
];

const SecondPage: React.FC = () => {
    
  const [posts, setPosts] = useState<Post[]>([]);
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});
  const [selected, setSelected] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/posts")
      .then((response) => setPosts(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleToggle = (department: string) => {
    setOpen((prevOpen) => ({ ...prevOpen, [department]: !prevOpen[department] }));
  };

  const handleSelect = (name: string, isSub: boolean, parent?: string) => {
    setSelected((prevSelected) => {
      const newSelected = { ...prevSelected, [name]: !prevSelected[name] };

      if (isSub && parent) {
        const allSelected = departmentData
          .find((dept) => dept.department === parent)
          ?.sub_departments.every((sub) => newSelected[sub]);
        newSelected[parent] = allSelected || false;
      }

      if (!isSub) {
        departmentData
          .find((dept) => dept.department === name)
          ?.sub_departments.forEach((sub) => { newSelected[sub] = newSelected[name]; });
      }

      return newSelected;
    });
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "title", headerName: "Title", width: 150 },
    { field: "body", headerName: "Body", width: 250 },
  ];


  return (
    <Container >
      <div style={{ height: 400, width: "100%", marginTop: "50px"}}>
        <DataGrid 
          rows={posts}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
        />
      </div>
      <List sx={{ 
        mt : 3,
      }}>
        {departmentData.map((department) => (
          <div key={department.department} >
            <ListItem  onClick={() => handleToggle(department.department)}>
              <Checkbox
                checked={selected[department.department] || false}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(department.department, false);
                }}
              />
              <ListItemText primary={department.department} />
              {open[department.department] ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open[department.department]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {department.sub_departments.map((sub) => (
                  <ListItem key={sub} sx={{ pl: 4 }}>
                    <Checkbox
                      checked={selected[sub] || false}
                      onClick={() => handleSelect(sub, true, department.department)}
                    />
                    <ListItemText primary={sub} />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </div>
        ))}
      </List>
    </Container>
  );
};

export default SecondPage;
