import styles from "./loader.module.scss";

const Loader: React.FC = () => {
	return (
		<div className={styles.spinner}>
			<div className="bounce1"></div>
			<div className="bounce2"></div>
			<div className="bounce3"></div>
		</div>
	);
};

export default Loader;
