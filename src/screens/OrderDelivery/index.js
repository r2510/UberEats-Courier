import { useRef, useMemo, useEffect, useState } from "react";
import { View, Text, Dimensions, useWindowDimensions, ActivityIndicator, Pressable } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import styles from "./styles";

import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import * as Location from 'expo-location';
import { Entypo, MaterialIcons, Ionicons } from '@expo/vector-icons';

import MapViewDirections from "react-native-maps-directions";

import { useNavigation, useRoute } from "@react-navigation/native";
import BottomSheetDetails from "./BottomSheetDetails";

import CustomMarker from "./CustomMarker";



import { useOrderContext } from "../../contexts/OrderContext";
import { DataStore } from "aws-amplify";
import { Order } from "../../models";





const OrderDelivery = () => {


    const {
        acceptOrder, 
        fetchOrder, 
        order, 
        completeOrder,
        pickUpOrder
    } = useOrderContext();

    const [driverLocation, setDriverLocation] = useState(null);
    const [totalMins, setTotalMins] = useState(0);
    const [totalKm, setTotakKms] = useState(0);


    const { width, height } = useWindowDimensions();

    const navigation = useNavigation();
    const route = useRoute();
    const id = route.params?.id;

    useEffect(async ()=>{
        await fetchOrder(id)
    }, [id]);

    // useEffect(async()=>{
    //     if(!order)
    //         return;
    //     const subscription = await DataStore.observe(Order, order.id).subscribe(msg =>{
    //         console.log('msg',msg);
    //     })
    //     return ()=>subscription.unsubscribe();
    // }, [order]);

    useEffect(() => {
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setDriverLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });
        })();
        const foregroundSubscrption = Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,//High accuracy more correct
                distanceInterval: 500//every 500 meter check location
            }, (updatedLocation) => {
                setDriverLocation({
                    latitude: updatedLocation.coords.latitude,
                    longitude: updatedLocation.coords.longitude
                });
            }
        )
        return foregroundSubscrption; //clean up function
    }, []);


    const mapRef = useRef(null);//using mapRef now you can use or set map parameter from outside..baseically it is now a refrence variable


  

    const restaurantLocation = { latitude: order?.Restaurant?.lat, longitude: order?.Restaurant?.lng };
    const deliveryLocation = { latitude: order?.User?.lat, longitude: order?.User?.lng };

    if (!driverLocation || !order ) {
        return (
            <ActivityIndicator size={'large'} color='grey' />
        );
    }

    return (
        <GestureHandlerRootView style={styles.container}>

            <MapView
                ref={mapRef}
                style={{ height: height, width: width }}
                showsUserLocation={true}
                followsUserLocation={true}
                initialRegion={{
                    latitude: driverLocation.latitude,
                    longitude: driverLocation.longitude,
                    latitudeDelta: 0.07,//zoom level
                    longitudeDelta: 0.07//zoom level
                }}
            >
                <MapViewDirections
                    origin={driverLocation}
                    destination={
                        order.status == 'ACCEPTED'
                            ? restaurantLocation
                            : deliveryLocation
                    }
                    strokeWidth={10}//that thick line
                    waypoints={order.status == 'ACCEPTED' ? [restaurantLocation] : []}//different stops
                    strokeColor="#3FC060"
                    apikey={"AIzaSyBrO9SojRm-WRO1AHqDxmcJ4vbOZoJ-eXw"}
                    onReady={(result) => {
                        // setDriverClose(result.distance <= 0.1);//if driver is less than 100 meter distance to restaurant diable the accept order button
                        setTotalMins(result.duration);
                        setTotakKms(result.distance);
                    }}
                />
                <CustomMarker data={order.Restaurant} type="RESTAURANT"/>
                <CustomMarker data={order.User} type="USER"/>
            </MapView>
            <BottomSheetDetails 
            id={id}
            totalKm={totalKm} 
            totalMins={totalMins} 
            mapRef={mapRef} 
            driverLocation={driverLocation}
            />
            {
                order.status == 'READY_FOR_PICKUP' && (
                    <Ionicons
                        onPress={() => navigation.goBack()}
                        name="arrow-back-circle"
                        size={45}
                        color='black'
                        style={{ top: 40, left: 15, position: 'absolute' }}
                    />
                )
            }

        
        </GestureHandlerRootView>
    );
}
export default OrderDelivery;