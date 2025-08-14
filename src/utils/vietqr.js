export const buildVietQRUrl = ({
  bank = "TPB",          // vcb, mb, tpb, bidv, acb, vtb ...
  accountNumber = "04330819301",
  accountName = "VO TUAN HIEP", // không dấu càng tốt
  amount,
  addInfo,               // paymentCode duy nhất cho mỗi lần thanh toán
  template = "print",    // compact | qr_only | print
}) => {
  const params = new URLSearchParams({
    amount: String(Math.max(0, Math.floor(amount || 0))),
    addInfo: addInfo || "",
    accountName: accountName || "",
  });
  return `https://img.vietqr.io/image/${bank}-${accountNumber}-${template}.png?${params.toString()}`;
};
