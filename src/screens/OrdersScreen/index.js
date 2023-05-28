import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Text, FlatList, Dimensions, useWindowDimensions, ActivityIndicator } from "react-native";
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// import orders from '../../data/orders.json'
import OrderItem from "../../components/OrderItem";
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import { PermissionsAndroid } from "react-native";
import { Entypo } from '@expo/vector-icons';

import * as Location from 'expo-location';

import { DataStore } from "aws-amplify";
import { Order, Restaurant, User } from "../../models";


const OrdersScreen = () => {
    const [orders, setOrders] = useState([]);
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ["12%", "90%"], [])//performance

    const { width, height } = useWindowDimensions();


    const [isMapReady, setMapReady] = useState(false);

    const mapRef = useRef(null);

    const fetchOrder = async ()=>{
        const currentOrders = await DataStore.query(Order);
        //updating orders array
        const updatedOrders = await currentOrders.map( async (oneOrder) =>({
            ...oneOrder,
            Restaurant: await getOrder(oneOrder.orderRestaurantId),
            User: await getUser(oneOrder.userID),
        }))
        const finalResult = await Promise.all(updatedOrders);
        console.log('finalResult', updatedOrders);
        setOrders(finalResult);
    }

    useEffect(async ()=>{
        await fetchOrder();
        const subscription = await DataStore.observe(Order).subscribe((msg)=>{
            if(msg.opType==="UPDATE"){
                fetchOrder();
            }
        })
        return () => subscription.unsubscribe();
    }, []);

    const getOrder = async(id) =>{
        return await DataStore.query(Restaurant, id);
    }
    const getUser = async(id) =>{
        return await DataStore.query(User, id);
    }

    useEffect(() => {
        (async () => {
          
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.log('Permission to access location was denied');
            return;
          }
    
          let location = await Location.getCurrentPositionAsync({});
        })();
      }, []);


    // useEffect(() => {
    //     const requestLocationPermission = async () => {
    //         try {
    //             const granted = await PermissionsAndroid.request(
    //                 PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //                 {
    //                     title: 'Location permission is required for this app',
    //                     message: 'This app needs location permission to show your current location on the map.',
    //                     buttonNeutral: 'Ask Me Later',
    //                     buttonNegative: 'Cancel',
    //                     buttonPositive: 'OK',
    //                 },
    //             );
    //             if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //                 setMapReady(true);
    //                 console.log('Location permission granted');
    //             } else {
    //                 console.log('Location permission denied');
    //             }
    //         } catch (err) {
    //             console.warn(err);
    //         }
    //     };
    //     requestLocationPermission();
    // }, []);

    if(orders.length === 0){
        return <ActivityIndicator size={30} />
    }

    return (
        <GestureHandlerRootView style={{ backgroundColor: 'lightblue', flex: 1 }}>
            <MapView
                style={isMapReady ? styles.mapStyle : {}}
                // ref={mapRef}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                followsUserLocation={true}
                showsMyLocationButton={true}
                onMapReady={() => {
                    PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        // {
                        //     title: 'Location permission is required for this app',
                        //     message: 'This app needs location permission to show your current location on the map.',
                        //     buttonNeutral: 'Ask Me Later',
                        //     buttonNegative: 'Cancel',
                        //     buttonPositive: 'OK',
                        // },
                    ).then(
                        setMapReady(true))
                }}
            >
                {
                    orders.map((order) => (
                        <Marker key={order.id} title={order.Restaurant.name} description={order.Restaurant.address} 
                        coordinate={{
                            latitude: order.Restaurant.lat,
                            longitude: order.Restaurant.lng
                        }}
                        >
                            <View style={{ backgroundColor: 'green', padding: 5, borderRadius: 5 }}>
                                <Entypo name="shop" size={25} color='white' />
                            </View>
                        </Marker>
                    ))
                }
                
            </MapView>
            <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} >
                <View style={{ alignItems: 'center', marginBottom: 30 }}>
                    <Text style={{ fontSize: 20, fontWeight: '700', letterSpacing: 0.5, paddingBottom: 5 }}>You're Online</Text>
                    <Text style={{ letterSpacing: 0.5, color: 'grey' }}>Available Orders: {orders.length}</Text>

                </View>
                <BottomSheetFlatList
                    data={orders}
                    renderItem={({ item }) => <OrderItem order={item} />}
                />
            </BottomSheet>
        </GestureHandlerRootView>
    );
}
export default OrdersScreen

const styles = StyleSheet.create({
    mapStyle: {
        height: '100%',
        width: '100%'
    }
});
