export default (data) => {
  // 假设 data 是返回来的二进制数据
  const url = window.URL.createObjectURL(
    new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
  );
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.setAttribute('download', 'excel-tmpl.xlsx');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

