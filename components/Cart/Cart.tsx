import CartItem from "../CartItem/CartItem";
import styles from "./Cart.module.scss";
import { CartItemType } from "../../pages/index";
import Button from "@mui/material/Button";

type Props = {
	cartItems: CartItemType[];
	addToCart: (clickedItem: CartItemType) => void;
	removeFromCart: (id: number) => void;
};

const Cart: React.FC<Props> = ({ cartItems, addToCart, removeFromCart }) => {
	const calculateTotal = (items: CartItemType[]) =>
		items.reduce((ack: number, item) => ack + item.amount * item.price, 0);

	return (
		<div className={styles.Wrapper}>
			<h2>Your Shopping Cart</h2>
			{cartItems.length === 0 ? <p>No items in cart.</p> : null}
			{cartItems.map((item) => (
				<CartItem
					key={item.id}
					item={item}
					addToCart={addToCart}
					removeFromCart={removeFromCart}
				/>
			))}
			<div className={styles.wrapper2}>
				<h2>Total: ₹{calculateTotal(cartItems).toFixed(2)}</h2>
				<Button size="small" disableElevation variant="contained">
					Buy Now
				</Button>
			</div>
		</div>
	);
};

export default Cart;
