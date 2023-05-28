import { createContext, useState, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import { DataStore } from "aws-amplify";
import { Order, Restaurant, User, OrderDish } from "../models";


const OrderContext = createContext({});


const OrderContextProvider = ({children})=>{


    const {dbCourier} = useAuthContext();
    const [order, setOrder] = useState();

    const pickUpOrder = async (id)=>{
        const currentOrder = await DataStore.query(Order, id);
        const updatedOrder = await DataStore.save(
            Order.copyOf(currentOrder, (updated)=>{
                updated.status = 'PICKED_UP';
                updated.Courier = dbCourier
            })
        );
        const finalOrder = await {
            ...updatedOrder,
            Restaurant: await getOrder(updatedOrder.orderRestaurantId),
            User: await getUser(updatedOrder.userID),
            DishItem: await getOrderDish(updatedOrder.id)
        }
        setOrder(finalOrder);
    }

    const completeOrder = async (id) =>{
        const currentOrder = await DataStore.query(Order, id);
        const updatedOrder = await DataStore.save(
            Order.copyOf(currentOrder, (updated)=>{
                updated.status = 'COMPLETED';
            })
        );
        const finalOrder = await {
            ...updatedOrder,
            Restaurant: await getOrder(updatedOrder.orderRestaurantId),
            User: await getUser(updatedOrder.userID),
            DishItem: await getOrderDish(updatedOrder.id)
        }
        setOrder(finalOrder);
    }


    const fetchOrder = async (id)=>{
        if(!id)
            return;
        const currentOrder = await DataStore.query(Order, id);
        //updating orders array
        const updatedOrder = await {
            ...currentOrder,
            Restaurant: await getOrder(currentOrder.orderRestaurantId),
            User: await getUser(currentOrder.userID),
            DishItem: await getOrderDish(currentOrder.id)
        }
        setOrder(updatedOrder);

        console.log('fetchOrder', updatedOrder);
    }

    const getOrder = async(id) =>{
        return await DataStore.query(Restaurant, id);
    }
    const getUser = async(id) =>{
        return await DataStore.query(User, id);
    }
    const getOrderDish = async(id) =>{
        return await DataStore.query(OrderDish, od => od.orderID.eq(id));
    }

    const acceptOrder = async (id) =>{
        //update the order, and change status , and assign driver
        const currentOrder = await DataStore.query(Order, id);
        const updatedOrder = await DataStore.save(
            Order.copyOf(currentOrder, (updated)=>{
                updated.status = "ACCEPTED";
                updated.Courier = dbCourier
            })
        );
        const finalOrder = await {
            ...updatedOrder,
            Restaurant: await getOrder(updatedOrder.orderRestaurantId),
            User: await getUser(updatedOrder.userID),
            DishItem: await getOrderDish(updatedOrder.id)
        }
        setOrder(finalOrder);
    }

    return(
        <OrderContext.Provider value={{acceptOrder, fetchOrder, order, completeOrder, pickUpOrder}}>
            {children}
        </OrderContext.Provider>
    );
}
export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext);