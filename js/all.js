//console.log(api_path, token);//測試是否有成功取到config值

//抓取dom區
const productList = document.querySelector('.productWrap');//產品列表外層
//console.log(productList);//測試
const productSelect = document.querySelector('.productSelect');//產品下拉選單
//console.log(productSelect.value);//測試
const cartList = document.querySelector('.shoppingCart-table-tbody');//購物車列表tbody
//console.log(cartList);//測試
const discardAllBtn = document.querySelector('.discardAllBtn')//刪除購物車內全部訂單按鈕
//console.log(discardAllBtn);//測試
const orderInfoBtn = document.querySelector('.orderInfo-btn')//送出預定資料按鈕
//console.log(orderInfoBtn);//測試

/*let str = `<li class="productCard">
        <h4 class="productType">新品</h4>
        <img
          src="https://hexschool-api.s3.us-west-2.amazonaws.com/custom/dp6gW6u5hkUxxCuNi8RjbfgufygamNzdVHWb15lHZTxqZQs0gdDunQBS7F6M3MdegcQmKfLLoxHGgV3kYunUF37DNn6coPH6NqzZwRfhbsmEblpJQLqXLg4yCqUwP3IE.png"
          alt="">
        <a href="#" id="addCardBtn">加入購物車</a>
        <h3>Antony 雙人床架／雙人加大</h3>
        <del class="originPrice">NT$18,000</del>
        <p class="nowPrice">NT$12,000</p>
      </li>`;*/ //測試是否正常組合用

//跑forEach空陣列區
let productData = [];//渲染產品列表初始化用
//productList.innerHTML = str;//測試
let cartData = [];//渲染購物車列表初始化用

//初始化渲染畫面執行區
function init() {
  getProductList();//渲染產品列表
  getCartList();//渲染購物車列表
}
init();

//axios 串接api 抓取產品列表資料
function getProductList() {
  axios.get(`${url}/${api_path}/products`)
    .then((res) => {
      //console.log(res);//測試
      productData = res.data.products;
      //console.log(productData);//測試
      renderproductList();
    })
};

//axios 串接api 抓取購物車列表資料 渲染購物車區塊
function getCartList() {
  axios.get(`${url}/${api_path}/carts`)
    .then((res) => {
      //console.log(res.data);//測試回傳

      //console.log(res.data.finalTotal);//測試 總金額
      //總金額部分
      document.querySelector('.js-final-total').textContent = res.data.finalTotal;

      cartData = res.data.carts;
      //console.log(cartData);//測試
      let str = '';
      cartData.forEach((item) => {
        str += `<tr>
            <td>
              <div class="cardItem-title">
                <img src="${item.product.images}" alt="">
                <p>${item.product.title}</p>
              </div>
            </td>
            <td>NT$${item.product.price}</td>
            <td>${item.quantity}</td>
            <td>NT$${item.product.price * item.quantity}</td>
            <td class="discardBtn">
              <a href="#" class="material-icons" data-order-id="${item.id}">
                clear
              </a>
            </td>
          </tr>`
      });
      cartList.innerHTML = str;
    });
};

//消除重複程式碼 將字串宣告成函式 回傳 參數代item
function combineProductHTMLItem(item) {
  return `<li class="productCard">
        <h4 class="productType">新品</h4>
        <img
          src="${item.images}"
          alt="">
        <a href="#" class="js-addCart" id="addCardBtn" data-id="${item.id}">加入購物車</a>
        <h3>${item.title}</h3>
        <del class="originPrice">NT$${item.origin_price}</del>
        <p class="nowPrice">NT$${item.price}</p>
      </li>`
};

//渲染產品列表函式
function renderproductList() {
  let str = '';
  productData.forEach((item) => {
    //str += `<li>${item.title}</li>`;//測試
    str += combineProductHTMLItem(item);
  })
  productList.innerHTML = str;
};

//監聽下拉選單 篩選 重組字串 渲染畫面
productSelect.addEventListener('change', (e) => {
  //console.log(e.target.value);//測試
  const category = e.target.value
  if (category === '全部') {
    renderproductList();
    return;
  }
  let str = '';
  productData.forEach((item) => {
    if (item.category === category) {
      str += combineProductHTMLItem(item);;
    }
  })
  productList.innerHTML = str;
});

//監聽外層ul click事件
productList.addEventListener('click', (e) => {
  e.preventDefault();//取消預設功能 此處為取消a標籤href="#"預設功能
  //console.log(e.target.getAttribute('data-id'));//使用getAttribute抓取標籤屬性值 測試是否按鈕有抓取到id產品編號
  let addCartClass = e.target.getAttribute('class');
  if (addCartClass !== 'js-addCart') {
    alert(`請點擊按鈕位置`);
    return
  }
  let productId = e.target.getAttribute('data-id');
  //console.log(productId);//測試用

  let numCheck = 1;//比對購物車內資料
  cartData.forEach((item) => {
    if (item.product.id === productId) {
      numCheck = item.quantity += 1;
    }
  })
  //console.log(numCheck);//測試

  axios.post(`${url}/${api_path}/carts`, {
    "data": {//參數代入後端要求格式
      "productId": productId,
      "quantity": numCheck
    }
  })
    .then((res) => {
      //console.log(res);//測試按鈕
      alert(`加入購物車`);
      getCartList();//重新渲染畫面
    })

});

//購物車資料 單筆訂單刪除功能 渲染畫面
cartList.addEventListener('click', (e) => {
  e.preventDefault();//標籤預設功能取消
  //console.log(e.target);//測試
  const cartId = e.target.getAttribute('data-order-id');
  //console.log(cartId);//測試
  if (cartId === null) {
    //console.log(`請對準XX`);//測試
    return;
  }

  axios.delete(`${url}/${api_path}/carts/${cartId}`)
    .then((res) => {
      alert(`刪除該筆訂單`);
      getCartList();//重新渲染 購物車區塊
    })
})

//刪除全部訂單按鈕
discardAllBtn.addEventListener('click', (e) => {
  e.preventDefault();//取消a標籤預設功能

  axios.delete(`${url}/${api_path}/carts`)//不需要單筆訂單id 只需將carts資料delete即全部刪除
    .then((res) => {
      alert(`購物車已全部清空!`)//提示
      getCartList();//重新渲染 購物車區塊
    })
    .catch((res) => {
      alert(`購物車內無訂單,請勿重複點擊!`)
    })
})

//監聽 送出預定資料按鈕 click事件
orderInfoBtn.addEventListener('click', (e) => {
  e.preventDefault();//取消預設html標籤功能
  //console.log(`點擊正確`);//測試
  if (cartData.length === 0) {//當購物車資料 陣列長度為0時 也就是沒資料
    alert(`請加入欲購買項目`)
    return;//中斷
  } else {
    //抓取input dom的.value 
    const customerName = document.querySelector('#customerName').value;//抓取表單input Name value值
    const customerPhone = document.querySelector('#customerPhone').value;//抓取表單input Phone value值
    const customerEmail = document.querySelector('#customerEmail').value;//抓取表單input Email value值
    const customerAddress = document.querySelector('#customerAddress').value;//抓取表單input Address value值
    const customerTradeWay = document.querySelector('#tradeWay').value;//抓取表單input TradeWay value值
    const orderInfoForm = document.querySelector('.orderInfo-form');//抓取form 做送出訂單後清空表單內容用

    //如果未填寫資料 送出排錯
    if (customerName == '' || customerPhone == '' || customerEmail == '' || customerAddress == '' || customerTradeWay == '') {//如果input的.value是空值
      alert('請輸入寄送資料,我不會通靈');//提示
      return;//中斷
    }

    axios.post(`${url}/${api_path}/orders`, {//post請求 送至後端資料庫
      "data": {//複製api文件 訂單相關(客戶) 的data格式
        "user": {
          "name": customerName,//帶入input的value
          "tel": customerPhone,//帶入input的value
          "email": customerEmail,//帶入input的value
          "address": customerAddress,//帶入input的value
          "payment": customerTradeWay//帶入input的value
        }
      }
    })
      .then((res) => {
        alert(`已送出訂單,感謝您的訂購!我們會在365天後為您送至府上,請耐心等候^_^!`)//提示
        getCartList();//重新渲染購物車區塊 清空
        orderInfoForm.reset();//清空表單內容
      })



    //console.log(customerName, customerPhone, customerEmail, customerAddress, customerTradeWay);//測試
  }
})