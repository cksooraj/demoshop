import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import Grid from "@mui/material/Grid";
import Item from "../components/item/item";
import Drawer from "@mui/material/Drawer";
import Cart from "../components/Cart/Cart";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Badge from "@mui/material/Badge";
import { Pagination } from "@mui/material";
import usePagination from "../hooks/pagination";
import { RootState } from "../app/store";
import { useSelector, useDispatch } from "react-redux";
import { setCartItemsData } from "../app/reducer";
import Router from "next/router";
import useCartStore from "../app/useStore";
import Loader from "../components/loader/loader";

export type CartItemType = {
	id: number;
	category: string;
	description: string;
	image: string;
	price: number;
	title: string;
	amount: number;
	rating: any;
};

interface HomeProps {
	items: CartItemType[];
}

export default function Home(props: HomeProps) {
	//const cart = useSelector((state: RootState) => state.cart.cartItems); redux removed

	const cartZustad = useCartStore((state) => state.cartItems);
	const addToCart = useCartStore((state) => state.setCartItemsData);

	console.log(cartZustad, "dsf");

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

	// handling pagination data
	const [page, setPage] = useState(0);
	const _DATA = usePagination(props?.items, 6);
	const handleChange = (e: any, p: any) => {
		setPage(p);
		_DATA.jump(p);
	};
	//storing in zustad / redux

	useEffect(() => {
		//	dispatch(setCartItemsData(cartItems));
		addToCart(cartItems);
	}, [cartItems]);

	//loading conditions

	const [loading, setLoading] = useState(false);

	Router.events.on("routeChangeStart", () => {
		setLoading(true);
	});

	Router.events.on("routeChangeComplete", () => {
		setLoading(false);
	});

	return (
		<>
			<Head>
				<title>{"Shopping"}</title>
			</Head>
			<div className={styles.container}>
				<div className={styles.heading}>Shopping App</div>
				<div className={styles.wrapper}>
					<Drawer
						anchor="right"
						open={cartOpen}
						onClose={() => setCartOpen(false)}
					>
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
					<Grid container spacing={3}>
						{_DATA.currentData()?.map((item) => (
							<Grid item key={item.id} xs={12} sm={4}>
								<Item item={item} handleAddToCart={handleAddToCart} />
							</Grid>
						))}
					</Grid>

					<div className={styles?.paginationBar}>
						<Pagination
							count={Math.ceil(props?.items?.length / 5)}
							size="large"
							page={page}
							variant="outlined"
							shape="rounded"
							onChange={handleChange}
						/>
					</div>
				</div>
				{loading && <Loader />}
			</div>
		</>
	);
}
//api call to get all crt items
export const getStaticProps = async () => {
	try {
		const data = await fetch(`https://fakestoreapi.com/products`);
		const json = await data.json();
		return {
			props: {
				items: json,
			},
		};
	} catch (err) {
		return {
			props: {
				items: [],
			},
		};
	}
};
