import Button from "@mui/material/Button";
// Types
import { CartItemType } from "../../pages/index";
// Styles
import styles from "./item.module.scss";
import Rating from "@mui/material/Rating";
import Link from "next/link";

type Props = {
	item: CartItemType;
	handleAddToCart: (clickedItem: CartItemType) => void;
};

const Item: React.FC<Props> = ({ item, handleAddToCart }) => (
	<div className={styles.Wrapper}>
		<img src={item.image} alt={item.title} />

		<div>
			<h3>{item.title}</h3>
		</div>
		<div className={styles.ratingAndAmount}>
			{" "}
			<h3>₹{item.price}</h3>{" "}
			<Rating name="read-only" value={item?.rating?.rate} readOnly />{" "}
		</div>

		<Button>
			{" "}
			<Link href={`/product/${item.id}`}> View </Link>
		</Button>
		<Button onClick={() => handleAddToCart(item)}>Add to cart</Button>
	</div>
);

export default Item;
