let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price) {

    const existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(name + " added to cart!");
}

function displayCart() {

    const cartItems = document.getElementById("cartItems");
    const totalElement = document.getElementById("total");

    if (!cartItems) return;

    cartItems.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
        totalElement.innerText = "0";
        return;
    }

    cart.forEach((item, index) => {

        const itemTotal = item.price * item.quantity;

        total += itemTotal;

        cartItems.innerHTML += `
            <div class="cart-item">
                <div>
                    <h3>${item.name}</h3>
                    <p>₹${item.price} × ${item.quantity}</p>
                </div>

                <div>
                    <strong>₹${itemTotal}</strong>
                    <button onclick="removeItem(${index})">
                        Remove
                    </button>
                </div>
            </div>
        `;
    });

    totalElement.innerText = total;
}

function removeItem(index) {

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
}

function placeOrder() {

    const name = document.getElementById("customerName").value;
    const phone = document.getElementById("customerPhone").value;

    if (name === "" || phone === "") {
        alert("Please enter your details.");
        return;
    }

    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    fetch("php/place_order.php", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            customer_name: name,
            phone: phone,
            items: cart
        })

    })
    .then(response => response.json())
    .then(data => {

        if (data.success) {

            alert("Order placed successfully!");

            localStorage.removeItem("cart");

            cart = [];

            window.location.href = "orders.html";

        } else {

            alert(data.message);
        }

    })
    .catch(error => {

        console.error(error);

        alert("Unable to place order.");

    });
}

function loadOrders() {

    const ordersContainer = document.getElementById("orders");

    if (!ordersContainer) return;

    fetch("php/get_orders.php")

        .then(response => response.json())

        .then(data => {

            ordersContainer.innerHTML = "";

            if (data.length === 0) {

                ordersContainer.innerHTML =
                    "<p style='text-align:center'>No orders found.</p>";

                return;
            }

            data.forEach(order => {

                ordersContainer.innerHTML += `

                    <div class="order-card">

                        <h3>Order #${order.id}</h3>

                        <p>
                            <strong>Name:</strong>
                            ${order.customer_name}
                        </p>

                        <p>
                            <strong>Phone:</strong>
                            ${order.phone}
                        </p>

                        <p>
                            <strong>Total:</strong>
                            ₹${order.total}
                        </p>

                        <p>
                            <strong>Status:</strong>
                            ${order.status}
                        </p>

                    </div>
                `;
            });

        })

        .catch(error => {

            console.error(error);

            ordersContainer.innerHTML =
                "<p>Unable to load orders.</p>";

        });
}

displayCart();
