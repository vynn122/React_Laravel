import React, { use, useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  List,
  Modal,
  notification,
  Select,
  Space,
  Spin,
  Table,
  Tag,
} from "antd";
import { message } from "antd";
import { ExclamationCircleFilled, LoadingOutlined } from "@ant-design/icons";

import { request } from "../../utils/request";
import { FormatDateClientSide } from "../../utils/helper";
import MainPage from "../../component/layout/MainPage";

const RolePage = () => {
  useEffect(() => {
    getRole();
  }, []);

  const [role, setRole] = useState({
    list: [],
    total: 0,
    loading: false,
    success: false,
    open: false,
  });
  const [validate, setValidate] = useState({});
  const [filter, setFilter] = useState({
    txt_search: "",
    status: "",
  });

  const [formRef] = Form.useForm();

  // get role
  const getRole = async () => {
    setRole((pre) => ({
      ...pre,
      loading: true,
    }));
    let queryParam = "?page=1";
    if (filter.txt_search !== null && filter.txt_search !== "") {
      queryParam += "&txt_search=" + filter.txt_search;
    }
    // if (filter.status !== null && filter.status !== "") {
    //   queryParam += "&status=" + filter.status;
    // }
    if (filter.status === 0 || filter.status === 1) {
      queryParam += "&status=" + filter.status;
    }
    const res = await request("role" + queryParam, "get");
    if (res?.success) {
      setRole((pre) => ({
        ...pre,
        list: res.data,
        //  list: Array.isArray(res.data) ? res.data : [res.data],
        success: res.success,
        loading: false,
      }));
      // console.log(res.data);
      // console.log(res.success);
    }
  };
  const handleAdd = () => {
    setRole((pre) => ({
      ...pre,
      open: true,
    }));
  };
  const handleCloseModal = () => {
    setRole((pre) => ({
      ...pre,
      open: false,
    }));
    setValidate({});
    formRef.resetFields();
  };
  const handleSubmit = async (item) => {
    let data = {
      code: item.code,
      name: item.name,
      description: item.description,
      status: item.status,
    };
    // id: formRef.getFieldValue("id"),
    let url = "role";
    let method = "post";
    let id = formRef.getFieldValue("id");
    // check if edited or add mode
    if (id && id != null && id != undefined && id != "") {
      url += "/" + id;
      method = "put";
    }
    setRole((pre) => ({
      ...pre,
      loading: true,
    }));
    const res = await request(url, method, data);
    console.log(res);
    if (res?.success) {
      message.success(res.message);
      handleCloseModal();
      getRole();
    } else {
      console.log(res);
      setRole((pre) => ({
        ...pre,
        loading: false,
      }));
      setValidate(res.errors);
      // message.error(res.message);
    }
  };
  const handleEdit = (record) => {
    ///set field to the form
    formRef.setFieldsValue({
      // code: record.code,
      // name: record.name,
      // description: record.description,
      // status: record.status,
      ...record,
      id: record.id,
    });
    setRole((p) => ({
      ...p,
      open: true,
    }));
    // alert(JSON.stringify(record));
  };
  const handleDelete = async (record) => {
    Modal.confirm({
      title: "Do you want to delete this record?",
      icon: <ExclamationCircleFilled />,
      content: "Name: " + record.name,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        const res = await request("role/" + record.id, "delete");
        if (res?.success) {
          message.success(res.message);
          getRole();
        } else {
          message.error(res.message);
        }
      },
      onCancel() {},
    });

    // alert(JSON.stringify(record));
  };
  const handleFilter = () => {
    getRole();
    // message.info(`Search: ${filter.txt_search}, Status: ${filter.status}`);
  };

  return (
    <MainPage
      loading={role.loading}
      // spinning={role.loading}
    >
      <div>
        <h1>
          {filter.txt_search}- {filter.status}
        </h1>
        {/* <h1>{formRef.getFieldValue("id") + ""}</h1> */}
        <div className="flex justify-between mt-5">
          <Space>
            {/* <h2>Message: {role.success ? "Success" : "Failed"}</h2>
          <h1>Role {role.list.length}</h1> */}
            <Input.Search
              allowClear
              placeholder="Search"
              onChange={(e) =>
                setFilter({ ...filter, txt_search: e.target.value })
              }
            />
            <Select
              className="w-[130px]"
              allowClear={true}
              placeholder="Select Status"
              options={[
                {
                  label: "Active",
                  value: 1,
                },
                {
                  label: "In Active",
                  value: 0,
                },
              ]}
              onChange={(value) => setFilter({ ...filter, status: value })}
            />
            <Button type="primary" onClick={handleFilter}>
              Filter
            </Button>
          </Space>
          <Button className="ml-10" type="primary" onClick={handleAdd}>
            Add New Role
          </Button>
        </div>
        <Modal
          title={formRef.getFieldValue("id") ? "Update Role" : "Add New Role"}
          open={role.open}
          onCancel={handleCloseModal}
          footer={null}
        >
          <Form layout="vertical" onFinish={handleSubmit} form={formRef}>
            <Form.Item name={"code"} label="Code" {...validate.code}>
              <Input placeholder="Code" />
            </Form.Item>
            <Form.Item name={"name"} label="Role Name" {...validate.name}>
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item name={"description"} label="Description">
              <Input.TextArea placeholder="Description" />
            </Form.Item>
            <Form.Item name={"status"} label="Status" {...validate.status}>
              <Select
                placeholder="Select Status"
                options={[
                  {
                    label: "Active",
                    value: 1,
                  },
                  {
                    label: "In Active",
                    value: 0,
                  },
                ]}
              ></Select>
            </Form.Item>
            <div className="mt-10 text-right">
              <Space>
                <Button onClick={handleCloseModal}>Cancel</Button>
                <Button type="primary" htmlType="submit">
                  {formRef.getFieldValue("id") ? "Save Update" : "Save"}
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>

        {/* {role.list?.map((item, index) => (
        <div key={index}>
          {item.name} - {item.status ? "Active" : "In Active"}
        </div>
      ))} */}

        <Table
          className="mt-10"
          dataSource={role.list}
          rowKey="id"
          bordered={true}
          pagination={{ pageSize: 8 }}
          columns={[
            {
              key: "code",
              title: "Code",
              dataIndex: "code",
              // onHeaderCell: () => ({
              //   style: { background: "black" },
              // }),
            },
            {
              key: "name",
              title: "Name",
              dataIndex: "name",
            },
            {
              key: "description",
              title: "Description",
              dataIndex: "description",
            },

            {
              key: "created_at",
              title: "Created At",
              dataIndex: "created_at",
              // render: (value) => dayjs(value).format("DD/MM/YYYY h:m a"),
              render: (value) => FormatDateClientSide(value),
            },
            {
              width: "100px",
              key: "status",
              title: "Status",
              dataIndex: "status",
              align: "center",
              // render: (value) =>
              //   value ? (
              //     <Tag color="green">Active</Tag>
              //   ) : (
              //     <Tag color="red">In Active</Tag>
              //   ),
              render: (value) => (
                <Tag
                  color={value ? "green" : "red"}
                  className="w-20 text-center"
                >
                  {value ? "Active" : "Inactive"}
                </Tag>
              ),
            },
            {
              width: "250px",
              key: "action",
              title: "Action",
              align: "center",
              dataIndex: "id",
              /*
            in this render 
              -value return the value of the cell for this column (record[dataIndex]), 
              -record return the whole object (entire data object of the row), 
              -index return index 
            */
              render: (value, record, index) => (
                <Space>
                  <Button type="primary" onClick={() => handleEdit(record)}>
                    Edit
                  </Button>
                  <Button
                    danger
                    type="primary"
                    onClick={() => handleDelete(record)}
                  >
                    Delete
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </div>
    </MainPage>
  );
};
export default RolePage;
