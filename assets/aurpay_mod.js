if (typeof jQuery == 'undefined') {
    var script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.6.1.min.js';
    script.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(script);
}

var aurpay_auto = true;

var aurpay_api_host = "https://shopify.aurpay.net"

var body = document.body
var loadingDiv = document.createElement("div")
loading()

window.onload = function () {
    if (window.jQuery) {
        $(document).ready(function () {
            var paymentMethod = document.querySelector(".payment-method-list__item__info");
            if (paymentMethod && paymentMethod.textContent && paymentMethod.textContent.toLowerCase().includes("aurpay")) {
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    crossDomain: true,
                    url: aurpay_api_host + "/api/shopify/order/status",
                    data: {
                        order_id: window.Shopify.checkout.order_id,
                        own_domain_shop: window.location.origin,
                        shopify_shop: window.Shopify.shop,
                    },
                    success: function (res) {
                        if (res.status === 200 && res.order_status === "pending") {
                            aurpayInitPage()
                        } else {
                            console.error("The order status is  ", res.order_status)
                        }

                        loadingDiv.style.display = "none"
                    },
                    error: function (err) {
                        console.error(err)
                        alert("Request the aurpay service failed, Please try again and contact the official email => contact@aurpay.net")
                    }
                })
            } else {
                loadingDiv.style.display = "none"
            }
        })
    } else {
        console.error("Make sure you have the jQuery plugin installed")
        alert("Make sure you have the jQuery plugin installed")
    }
}

function aurpayInitPage() {

    document.title = document.title.replace("Thank you", "Review and pay")

    let mainHeader = document.querySelector("#main-header")
    if (mainHeader) {
        mainHeader.innerText = "Review and pay!"
    }

    let continueButton = document.querySelector(".step__footer__continue-btn")
    if (continueButton) {
        continueButton.style.visibility = "hidden"
    }

    let checkMarkIcon = document.querySelector(".os-header__hanging-icon")
    if (checkMarkIcon) {
        checkMarkIcon.style.visibility = "hidden"
    }

    var orderConfirmed = document.querySelector(".os-step__title")
    if (orderConfirmed) {
        orderConfirmed.style.display = "none"
    }

    let orderConfirmedDescription = document.querySelector(".os-step__description")
    if (orderConfirmedDescription) {
        orderConfirmedDescription.style.display = "none"
    }

    var button = document.createElement("button")
    var img = document.createElement("img")
    img.src = "".concat(aurpay_api_host, "/static/images/shopify_pay.png")
    img.alt = "Pay with Aurpay Crypto Payment"
    button.appendChild(img)
    button.style.outline = "none"
    button.onclick = function () {
        button.disabled = true

        const order_id = window.Shopify.checkout.order_id
        const currency = window.Shopify.checkout.currency.toUpperCase()
        const amount = window.Shopify.checkout.total_price
        const shopify_shop = window.Shopify.shop
        const own_domain_shop = window.location.origin
        // const user_email = window.Shopify.checkout.email

        if (order_id && order_id != "" && currency && currency != "" && amount && parseFloat(amount) > 0 && shopify_shop && shopify_shop != "" && own_domain_shop && own_domain_shop != "") {
            $.ajax({
                type: "POST",
                dataType: "json",
                crossDomain: true,
                url: aurpay_api_host + "/api/shopify/payment",
                data: {
                    order_id: order_id,
                    currency: currency,
                    amount: amount,
                    shopify_shop: shopify_shop,
                    own_domain_shop: own_domain_shop,
                    // user_email: user_email,
                    succeed_url: window.location.href,
                },
                success: function (res) {
                    if (res.status === 200 && res.redirect_url) {
                        window.location.href = res.redirect_url
                    } else {
                        console.error("redirectt_url is empty: ", res)
                    }
                },
                error: function (err) {
                    console.error(err)
                }
            })
        }
    }
    orderConfirmed.after(button)
    if (aurpay_auto) {
        button.click()
    }
}

function loading() {
    loadingDiv.style.width = "100%"
    loadingDiv.style.height = "100%"
    loadingDiv.style.position = "fixed"
    loadingDiv.style.zIndex = 999
    loadingDiv.style.backgroundColor = "#ffffff"
    var imgLoad = document.createElement("img")
    imgLoad.src = "".concat(aurpay_api_host, "/static/images/loading.gif")
    imgLoad.alt = "Aurpay Loading Image"
    imgLoad.style.width = "100px"
    imgLoad.style.height = "100px"
    loadingDiv.appendChild(imgLoad)
    body.insertBefore(loadingDiv, body.firstChild)
}
