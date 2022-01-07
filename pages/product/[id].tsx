import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
// Types
import { CartItemType } from "../index";
//style
import styles from "./product.module.scss";
import Image from "next/image";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import Drawer from "@mui/material/Drawer";
import Cart from "../../components/Cart/Cart";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Badge from "@mui/material/Badge";
import { RootState } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import { setCartItemsData } from "../../app/reducer";
import useCartStore from "../../app/useStore";

type Props = {
	data: CartItemType;
	handleAddToCart: (clickedItem: CartItemType) => void;
};

type params = {
	id: number;
};

export async function getStaticPaths() {
	const data = await fetch(`https://fakestoreapi.com/products`);
	const json = await data.json();
	const paths = json.map((item: CartItemType) => {
		return {
			params: {
				id: item.id.toString(),
			},
		};
	});

	return {
		paths,
		fallback: false,
	};
}

export async function getStaticProps({ params }: { params: params }) {
	const data = await fetch(`https://fakestoreapi.com/products/${params?.id}`);
	const json = await data.json();
	return {
		props: {
			data: json,
		},
	};
}

const Post: React.FC<Props> = ({ data }) => {
	//	const cart = useSelector((state: RootState) => state.cart.cartItems);

	const cartZustad = useCartStore((state) => state.cartItems);
	const addToCart = useCartStore((state) => state.setCartItemsData);

	const dispatch = useDispatch();
	//cart states (drawer)
	const [cartOpen, setCartOpen] = useState(false);
	const [cartItems, setCartItems] = useState(cartZustad);

	//getting total number of items
	const getTotalItems = (items: CartItemType[]) =>
		items.reduce((ack: number, item) => ack + item.amount, 0);

	//handling adding to cart
	const handleAddToCart = (clickedItem: CartItemType) => {
		setCartItems((prev) => {
			const isItemInCart = prev.find((item) => item.id === clickedItem.id);
			if (isItemInCart) {
				return prev.map((item) =>
					item.id === clickedItem.id
						? { ...item, amount: item.amount + 1 }
						: item
				);
			}
			return [...prev, { ...clickedItem, amount: 1 }];
		});
	};

	//handling removing from cart
	const handleRemoveFromCart = (id: number) => {
		setCartItems((prev) =>
			prev.reduce((ack, item) => {
				if (item.id === id) {
					if (item.amount === 1) return ack;
					return [...ack, { ...item, amount: item.amount - 1 }];
				} else {
					return [...ack, item];
				}
			}, [] as CartItemType[])
		);
	};
	//storing in redux

	useEffect(() => {
		//dispatch(setCartItemsData(cartItems));
		addToCart(cartItems);
	}, [cartItems]);

	return (
		<>
			<Head>
				<title>{data?.category}</title>
			</Head>
			<Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
				<Cart
					cartItems={cartZustad}
					addToCart={handleAddToCart}
					removeFromCart={handleRemoveFromCart}
				/>
			</Drawer>
			<div className={styles?.cartIcon}>
				<Badge
					badgeContent={getTotalItems(cartZustad)}
					color="error"
					onClick={() => setCartOpen(true)}
				>
					<AddShoppingCartIcon />
				</Badge>
			</div>
			<div className={styles.wrapper}>
				<div className={styles.imageWrapper}>
					<Image
						priority
						src={data?.image}
						className={data?.title}
						height={500}
						width={500}
						alt={data?.title}
					/>
				</div>
				<div className={styles.dataWrapper}>
					<h1>{data?.title}</h1>
					<div className={styles.priceAndRating}>
						<span>
							{" "}
							<Rating
								name="read-only"
								value={data?.rating?.rate}
								readOnly
							/>{" "}
							<span className={styles.ratingCount}> {data?.rating?.count}</span>
						</span>
						<h2>₹{data?.price}</h2>
					</div>
					<h3>{data?.description}</h3>
				</div>
			</div>
			<div className={styles.wrapper2}>
				<Button size="medium" variant="contained">
					<Link href={`/`}> Back </Link>
				</Button>
				<Button size="medium" variant="contained">
					Buy Now
				</Button>
				<Button
					size="medium"
					variant="contained"
					onClick={() => handleAddToCart(data)}
				>
					{" "}
					Add to Cart
				</Button>
			</div>
		</>
	);
};
export default Post;
