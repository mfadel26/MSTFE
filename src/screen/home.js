import React, { useEffect, useState, useRef } from "react";
import {Layout, Menu, Breadcrumb, Input, Space, Row, Col, Table, Button,PageHeader,Descriptions} from "antd";
import {options} from './opt_dummy'
import "antd/dist/antd.css";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { Autocomplete } from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import { Link, Redirect } from 'react-router-dom'
const axios = require("axios");
const { Header, Content, Footer } = Layout;

function Home() {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [prov, setProv] = useState("");
  const [kab, setKab] = useState(null);
  const [completeKab, setCompleteKab] = useState(null);
  const [Data, setData] = useState(null);
  const searchInput = useRef(null);
  
  useEffect(async () => {

    try {
      axios
        .get("http://localhost:6969/search-daerah/Nanggroe Aceh Darussalam (NAD)")
        .then((res) => {
          const dt = res.data.data;
          setData(dt);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  function getColumnSearchProps(dataIndex) {
    return {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 6 }}>
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ width: 170, marginBottom: 8, display: "block" }}
          />
          <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}>
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}>
            Reset
          </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
        }
      },
      render: (text) =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        ) : (
          text
        ),
    };
  }
  function handleSearch(selectedKeys, confirm, dataIndex) {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  }

  function handleReset(clearFilters) {
    clearFilters();
    setSearchText("");
  }
  const columns = [
    {
      title: "No Kode Pos",
      dataIndex: "kodepos",
      key: "kodepos",
      width: '15%',
      ...getColumnSearchProps("kodepos"),
    },
    {
      title: "Kelurahan",
      dataIndex: "kelurahan",
      key: "kelurahan",
      width: '40%',
      ...getColumnSearchProps("kelurahan"),
    },
    {
      title: "Kecamatan",
      dataIndex: "kecamatan",
      key: "kecamatan",
      width: '45%',
      ...getColumnSearchProps("kecamatan"),
    },
  ];
  const onChangeProv = (val) => {
    const province = val.target.textContent;
    setProv(val.target.textContent);
    if (province !== "") {
      axios
        .get(`http://localhost:6969/search-daerah/${province}`)
        .then((res) => {
          const dt = res.data.data;
          setKab(dt);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const onChangeKab = (val) => {
    const kabupaten = val.target.textContent;
    setProv(val.target.textContent);
    if (kabupaten !== "") {
      axios
        .get(`http://localhost:6969/search-daerah/${prov}?kota=${kabupaten}`)
        .then((res) => {
          const dt = res.data.data;
           setData(dt)
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  useEffect(() => {
    if (kab !== null) {
      setCompleteKab(kab);
    }
  }, [kab]);

  const logOut = async()=>{
  localStorage.clear();
  }

  return (
    <Layout className="layout">
     
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
          <Menu.Item key="1"> <Link to='/login'> MST</Link></Menu.Item>
        </Menu>
      </Header>
      <div className="site-page-header-ghost-wrapper">
    <PageHeader
      ghost={false}
      // onBack={() => window.history.back()}
      title="Hello"
      subTitle=""
      extra={[
        <Button key="1" type="primary" onClick={logOut}>
          <Link to='/login'>Log Out</Link>
        </Button>,
      ]}
    >
      
    </PageHeader>

  </div>
      <Content style={{ padding: "0 50px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}></Breadcrumb>
        <div className="site-layout-content">
        <h2>Filter </h2>
          <Row>
            <Col span={3}>  <h3> Propinsi </h3></Col>
            <Col span={8}>
              <Autocomplete
                id="combo-box-demo"
                options={options}
                getOptionLabel={(option) => option.value}
                onChange={(val) => onChangeProv(val)}
                style={{ width: 250, height: 70 }}
                renderInput={(params) => (
                  <TextField {...params} label="Provinsi" variant="outlined" />
                )}
              />
            </Col>
          </Row>
          <Row>
            <Col span={3}>
              <h3> Kabupaten</h3>
            </Col>
            <Col span={8}>
              <Autocomplete
                disabled={completeKab === null ? true : false}
                id="combo-box-demo"
                options={
                  completeKab &&
                  completeKab.filter(
                    (ele, ind) =>
                      ind ===
                      completeKab.findIndex((elem) => elem.nama_kota === ele.nama_kota)
                  )
                }
                getOptionLabel={(option) => option.nama_kota}
                style={{ width: 250, height: 90 }}
                onChange={(val) => onChangeKab(val)}
                renderInput={(params) => (
                  <TextField {...params} label="Kab/Kota" variant="outlined" size={5} />
                )}
              />
            </Col>
          </Row>
        </div>
        <div>
          <h2>Table MST </h2>
          <Table columns={columns} dataSource={Data == null ? [] : Data} />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}> Created by M.Fadel ©2021 </Footer>
    </Layout>
  );
}
export default Home;