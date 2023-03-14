import { Button, Modal, Skeleton, Table, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import { getContractNFTs } from "../utils";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },

  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "External Link",
    dataIndex: "external_url",
    key: "external_url",
    render: (value) => {
      if (value) {
        return (
          <a href={value} target="_blank" rel="noreferrer">
            View
          </a>
        );
      }

      return "--";
    },
  },
];

const ModalContent = ({ tokenAddress }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    getContractNFTs(tokenAddress)
      .then((resp) => {
        const filteredData = resp.result.filter(
          // the filter maintains those NFT with non-null metaData
          (item) => item.metadata !== null
        );
        const parsedData = filteredData.map((item) =>
          JSON.parse(item.metadata)
        );
        setData(parsedData);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  //since the dependency array is empty([]), it means that the effect should only run once, when the component is mounted.
  //This is equivalent to the behavior of the componentDidMount
  //lifecycle method in class components
  //it means each time the child modalContent is mounted, it fetch the data from getContractNFT

  if (loading) {
    return <Skeleton active />;
  }

  return <Table rowKey="name" columns={columns} dataSource={data} />;
};

const ContractNfts = ({ tokenAddress }) => {
  const [modalOpen, setModalOpen] = useState();

  return (
    <>
      <Tooltip title="NFT(s) in its contract">
        <Button
          style={{ border: "none" }}
          size="large"
          shape="circle"
          icon={<InfoCircleOutlined />}
          onClick={() => setModalOpen(true)}
        />
      </Tooltip>
      <Modal
        width={1000}
        title="NFT(s) List"
        destroyOnClose
        //destroyOnClose: Whether to unmount child components on onClose
        open={modalOpen}
        //Whether the modal dialog is visible or not. Use visible under 4.23.0 (why?)
        footer={null}
        onCancel={() => setModalOpen(false)}
        // this is 弹窗弹出table的窗口， controlled by modalOpen state, can be initialized by button above
      >
        <ModalContent tokenAddress={tokenAddress} />
        {/* This is the child component, props is still tokenaddress*/}
      </Modal>
    </>
  );
};

export default ContractNfts;
