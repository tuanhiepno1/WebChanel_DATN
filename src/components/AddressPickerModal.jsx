import React, { useEffect, useState, useMemo } from "react";
import { Modal, List, Radio, Tag, message, Button, Spin } from "antd";
import { getUserAddresses } from "@api/userApi";

// Lấy id địa chỉ an toàn theo nhiều kiểu khoá
const getAddressId = (addr) =>
  addr?.id ?? addr?.address_id ?? addr?.id_address ?? addr?._id ?? null;

const AddressPickerModal = ({ open, userId, onClose, onChoose }) => {
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const defaultAddress = useMemo(
    () =>
      addresses.find((a) => (a?.status || "").toLowerCase() === "default") ||
      null,
    [addresses]
  );

  useEffect(() => {
    const load = async () => {
      if (!open || !userId) return;
      setLoading(true);
      const res = await getUserAddresses(userId);
      setLoading(false);

      if (res?.ok) {
        const list = res.data?.addresses || [];

        // ✅ LỌC BỎ địa chỉ deleted
        const filtered = list.filter(
          (a) => (a?.status || "").toLowerCase() !== "deleted"
        );

        setAddresses(filtered);

        // ✅ Chọn mặc định từ danh sách đã lọc
        const def = filtered.find(
          (a) => (a?.status || "").toLowerCase() === "default"
        );
        setSelectedId(
          def ? getAddressId(def) : filtered[0] ? getAddressId(filtered[0]) : null
        );
      } else {
        message.error(res?.error || "Không tải được địa chỉ");
      }
    };
    load();
  }, [open, userId]);

  return (
    <Modal
      open={open}
      title="Chọn địa chỉ giao hàng"
      onCancel={onClose}
      onOk={() => {
        const chosen = addresses.find((a) => getAddressId(a) === selectedId);
        if (!chosen) {
          message.warning("Vui lòng chọn một địa chỉ.");
          return;
        }
        onChoose({
          addressId: getAddressId(chosen),
          name: chosen.recipient_name || "",
          phone: chosen.phone || "",
          address: chosen.address_line || "",
        });
      }}
      okText="Dùng địa chỉ này"
      destroyOnClose
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: 24 }}>
          <Spin />
        </div>
      ) : addresses.length === 0 ? (
        <div>
          Chưa có địa chỉ khả dụng. Vui lòng thêm địa chỉ trong trang{" "}
          <Button type="link" onClick={() => window.location.assign("/profile")}>
            hồ sơ cá nhân
          </Button>
          .
        </div>
      ) : (
        <Radio.Group
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          style={{ width: "100%" }}
        >
          <List
            dataSource={addresses}
            renderItem={(addr) => {
              const id = getAddressId(addr);
              const isDefault =
                (addr?.status || "").toLowerCase() === "default";
              return (
                <List.Item key={id}>
                  <List.Item.Meta
                    avatar={<Radio value={id} />}
                    title={
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          flexWrap: "wrap",
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>
                          {addr.recipient_name} • {addr.phone}
                        </span>
                        {isDefault && <Tag color="green">Mặc định</Tag>}
                      </div>
                    }
                    description={<span>{addr.address_line}</span>}
                  />
                </List.Item>
              );
            }}
          />
        </Radio.Group>
      )}
    </Modal>
  );
};

export default AddressPickerModal;
