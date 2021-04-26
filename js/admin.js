// C3.js
let chart = c3.generate({
  bindto: '#chart', // HTML 元素綁定
  data: {
    type: "pie",
    columns: [
      ['Louvre 雙人床架', 1],
      ['Antony 雙人床架', 2],
      ['Anty 雙人床架', 3],
      ['其他', 4],
    ],
    colors: {
      "Louvre 雙人床架": "#DACBFF",
      "Antony 雙人床架": "#9D7FEA",
      "Anty 雙人床架": "#5434A7",
      "其他": "#301E5F",
    }
  },
});
//dom區
const orderList = document.querySelector('.js-order-list');

//渲染畫面初始化
function init() {
  getOrderList();//渲染訂單區塊
  renderC3();//渲染C3區塊
}
init();

//取得客戶訂單資料
let orderData = [];
//渲染訂單區塊
function getOrderList() {
  axios.get(`${adminUrl}/${api_path}/orders`, {
    headers: {
      'Authorization': token,
    }
  })
    .then((res) => {
      //console.log(res.data);//測試
      orderData = res.data.orders
      //console.log(orderData);//測試

      //組訂單orderData字串
      let str = '';
      orderData.forEach((item) => {

        //組時間字串
        const timeStamp = new Date(item.createdAt * 1000);//時間戳 帶進訂單參數*1000變為13碼
        const orderTime = `${timeStamp.getFullYear()
          }/${timeStamp.getMonth() + 1}/${timeStamp.getDate()}`;//getMonth+1是因為從0開始算1月
        //console.log(orderTime);//測試

        //組orderData內的porducts多品項與數量字串
        let productsStr = '';
        item.products.forEach((productsItem) => {
          productsStr += `<p>${productsItem.title}x${productsItem.quantity}</p>`;
        });

        //判斷訂單處理狀態(已處理/未處理)
        let orderStatus = '';
        if (item.paid === true) {
          orderStatus = '已處理';
        } else {
          orderStatus = '未處理';
        };

        //組訂單個人資料部份字串
        str += `<tr>
            <td>${item.id}</td>
            <td>
              <p>${item.user.name}</p>
              <p>${item.user.tel}</p>
            </td>
            <td>${item.user.address}</td>
            <td>${item.user.email}</td>
            <td>
              ${productsStr}
            </td>
            <td>${orderTime}</td>
            <td class="js-orderStatus">
              <a href="#" class="orderStatus" data-status="${item.paid}" data-id="${item.id}">${orderStatus}</a>
            </td>
            <td>
              <input type="button" class="delSingleOrder-Btn js-orderDelete" data-id="${item.id}" value="刪除">
            </td>
          </tr>
          `;

      });
      orderList.innerHTML = str;
      renderC3();//渲染C3區塊
    });
};

//刪除按鈕功能與訂單狀態flase or true
orderList.addEventListener('click', (e) => {
  e.preventDefault();//取消預設
  const targetClass = e.target.getAttribute('class');//取得class的值
  //console.log(targetClass);//測試
  let id = e.target.getAttribute('data-id');
  if (targetClass === 'orderStatus') {//a標籤 訂單狀態
    let status = e.target.getAttribute('data-status');
    changeOrderStatus(status, id);
    return;
  }

  if (targetClass === 'delSingleOrder-Btn js-orderDelete') {//delete刪除按鈕
    //alert("這是訂單狀態");//測試
    deleteOrderItem(id)
    return;
  }

});

//更改訂單處理狀態判斷 put請求
function changeOrderStatus(status, id) {
  //console.log(status, id);//d測試
  let newStatus;
  if (status === true) {//當為t時
    newStatus = false;//改為f
  } else {//不然
    newStatus = true;//改為t
  }
  //格式axios.put(url,data,config)
  axios.put(`${adminUrl}/${api_path}/orders`, {
    "data": {
      "id": id,
      "paid": newStatus,
    }
  }, {
    headers: {
      'Authorization': token,
    }
  })
    .then((res) => {
      alert('已修改訂單處理狀態');//提示
      getOrderList();//重新渲染訂單區塊
    })
}

//刪除按鈕 刪除該筆訂單資料 delete 特定訂單id請求
function deleteOrderItem(id) {
  //console.log(id);//測試
  axios.delete(`${adminUrl}/${api_path}/orders/${id}`, {
    headers: {
      'Authorization': token,
    }
  })
    .then((res) => {
      alert('刪除該筆訂單成功');//提示
      getOrderList();//重新渲染
    })
}

//C3圖形渲染
function renderC3() {

}