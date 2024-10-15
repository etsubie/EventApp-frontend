import Header from "../../components/common/Header";
import OrdersTable from "../../components/orders/OrdersTable";

const OrdersPage = () => {
	return (
		<div className='flex-1 relative z-10 overflow-auto'>
			<Header title={"Orders"} />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<OrdersTable />
			</main>
		</div>
	);
};
export default OrdersPage;
