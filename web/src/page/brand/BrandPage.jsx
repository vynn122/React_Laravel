import React, { use, useEffect, useState } from "react";
import {
  Button,
  Form,
  Image,
  Input,
  List,
  Modal,
  notification,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Upload,
} from "antd";
import { message } from "antd";
import {
  ExclamationCircleFilled,
  LoadingOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import { request } from "../../utils/request";
import { FormatDateClientSide } from "../../utils/helper";
import MainPage from "../../component/layout/MainPage";
import config from "../../utils/config";

const BrandPage = () => {
  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload </div>
    </button>
  );
  useEffect(() => {
    getBrand();
  }, []);

  const [brand, setBrand] = useState({
    list: [],
    total: 0,
    loading: false,
    success: false,
    open: false,
  });
  const [fileList, setFileList] = useState([]);

  const [validate, setValidate] = useState({});
  const [filter, setFilter] = useState({
    txt_search: "",
    status: "",
  });

  const [formRef] = Form.useForm();

  // get brand
  const getBrand = async () => {
    setBrand((pre) => ({
      ...pre,
      loading: true,
    }));
    let queryParam = "?page=1";
    if (filter.txt_search !== null && filter.txt_search !== "") {
      queryParam += "&txt_search=" + filter.txt_search;
    }
    if (filter.status === 0 || filter.status === 1) {
      queryParam += "&status=" + filter.status;
    }
    const res = await request("brand" + queryParam, "get");
    if (res?.success) {
      setBrand((pre) => ({
        ...pre,
        list: res.data,
        success: res.success,
        loading: false,
      }));
    }
  };
  const handleAdd = () => {
    setBrand((pre) => ({
      ...pre,
      open: true,
    }));
  };
  const handleCloseModal = () => {
    setBrand((pre) => ({
      ...pre,
      open: false,
    }));
    setFileList([]);
    setValidate({});
    formRef.resetFields();
  };
  const handleSubmit = async (item) => {
    // id: formRef.getFieldValue("id")

    let formData = new FormData();
    formData.append("code", item.code);
    formData.append("name", item.name);
    formData.append("from_country", item.from_country);
    formData.append("status", item.status);
    if (item?.image && item?.image?.file && item?.image?.file?.originFileObj) {
      formData.append("image", item.image.file.originFileObj);
    } else if (item?.image?.file?.status === "removed") {
      let image_remove = item?.image?.file?.name;
      formData.append("image_remove", image_remove);
    }
    let url = "brand";
    let method = "post";
    let id = formRef.getFieldValue("id");
    // check if edited or add mode
    if (id && id != null && id != undefined && id != "") {
      url += "/" + id;
      method = "post";
      formData.append("_method", "PUT");
    }
    setBrand((pre) => ({
      ...pre,
      loading: true,
    }));
    const res = await request(url, method, formData);
    console.log(res);
    if (res?.success) {
      message.success(res.message);
      handleCloseModal();
      getBrand();
    } else {
      console.log(res);
      setBrand((pre) => ({
        ...pre,
        loading: false,
      }));
      setValidate(res.errors);
    }
  };
  const handleEdit = (record) => {
    console.log(record);
    formRef.setFieldsValue({
      ...record,
      id: record.id,
    });
    setBrand((p) => ({
      ...p,
      open: true,
    }));
    if (record.image == null) {
      setFileList([]);
      return;
    }
    setFileList([
      {
        uid: record.id,
        name: record.image,
        status: "done",
        url: config.IMAGE_PATH + record.image,
      },
    ]);
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
        const res = await request("brand/" + record.id, "delete");
        if (res?.success) {
          message.success(res.message);
          getBrand();
        } else {
          message.error(res.message);
        }
      },
      onCancel() {},
    });
  };
  const handleFilter = () => {
    getBrand();
  };
  const handleOnChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  return (
    <MainPage
      loading={brand.loading}
      // spinning={role.loading}
    >
      <div>
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
                  value: "active",
                },
                {
                  label: "In Active",
                  value: "inactive",
                },
              ]}
              onChange={(value) => setFilter({ ...filter, status: value })}
            />
            <Button type="primary" onClick={handleFilter}>
              Filter
            </Button>
          </Space>
          <Button className="ml-10" type="primary" onClick={handleAdd}>
            Add New Brand
          </Button>
        </div>
        <Modal
          title={formRef.getFieldValue("id") ? "Update Brand" : "Add New Brand"}
          open={brand.open}
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
            <Form.Item name={"from_country"} label="From Country">
              <Input.TextArea placeholder="From Country" />
            </Form.Item>
            <Form.Item name="image">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleOnChange}
                maxCount={1}
                customRequest={(e) => {
                  e.onSuccess();
                }}
              >
                {fileList.length === 1 ? null : uploadButton}
              </Upload>
            </Form.Item>
            <Form.Item name={"status"} label="Status" {...validate.status}>
              <Select
                placeholder="Select Status"
                options={[
                  {
                    label: "Active",
                    value: "active",
                  },
                  {
                    label: "In Active",
                    value: "inactive",
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
          dataSource={brand.list}
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
              key: "from_country",
              title: "From Country",
              dataIndex: "from_country",
            },
            {
              key: "image",
              title: "Image",
              dataIndex: "image",
              align: "center",
              render: (value) => (
                <Image
                  src={config.IMAGE_PATH + value}
                  alt="Brand"
                  style={{ width: 70 }}
                />
              ),
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
                  color={value === "active" ? "green" : "red"}
                  className="w-20 text-center"
                >
                  {value === "active" ? "Active" : "Inactive"}
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
export default BrandPage;
