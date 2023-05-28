import { useRef, useMemo, useEffect, useState } from "react";
import { View, Text, Dimensions, useWindowDimensions, ActivityIndicator, Pressable } from "react-native";
import BottomSheet from '@gorhom/bottom-sheet';
import { FontAwesome5, Fontisto } from '@expo/vector-icons';
import { useOrderContext } from "../../contexts/OrderContext";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";


const BottomSheetDetails = (props) =>{
    const {totalKm, totalMins, mapRef, driverLocation, id} = props;
    const isDriverClose = 0.5;
    const {
        acceptOrder, 
        fetchOrder, 
        order, 
        completeOrder,
        pickUpOrder
    } = useOrderContext();

    const navigation = useNavigation();

    const onButtonPressed = async () => {
        if (order.status == 'READY_FOR_PICKUP') {
        bottomSheetRef.current?.collapse();
            mapRef.current.animateToRegion({
                latitude: driverLocation.latitude,
                longitude: driverLocation.longitude,
                latitudeDelta: 0.01,//zoom
                longitudeDelta: 0.01
            });
            acceptOrder(id);
        }
        if (order.status === 'ACCEPTED') {
            await   pickUpOrder(id);
            bottomSheetRef.current?.collapse();
        }
        if (order.status == 'PICKED_UP') {
            await completeOrder(id);
            bottomSheetRef.current?.collapse();
            navigation.goBack();
        }
    }

    const renderButtonTitle = () => {
        if (order.status == 'READY_FOR_PICKUP') {
            return "Accept Order";
        }
        if (order.status == 'ACCEPTED') {
            return "Pick-up Order";
        }
        if (order.status == 'PICKED_UP') {
            return "Delivery Complete";
        }
    };

    const isButtonDisabled = () => {
        if (order.status == 'READY_FOR_PICKUP') {
            return false;
        }
        if (order.status == 'ACCEPTED' && isDriverClose) {
            return false;
        }
        if (order.status == 'PICKED_UP' && isDriverClose) {
            return false;
        }
        return true;
    }
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ["12%", "90%"], [])//performance
   
    return(
        <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} handleIndicatorStyle={styles.handleIndicator}>
                <View style={styles.bagContainer}>
                    <Text style={styles.inLineText}>{totalMins.toFixed(0)} min</Text>
                    <FontAwesome5
                        name="shopping-bag"
                        size={30}
                        color="#3FC060"
                        style={{ marginHorizontal: 10 }}
                    />
                    <Text style={styles.inLineText}>{totalKm.toFixed(1)} km</Text>
                </View>
                <View style={{ paddingHorizontal: 20 }}>
                    <Text style={styles.restaurantName}>{order.Restaurant.name}</Text>
                    <View style={styles.storeContainer}>
                        <Fontisto name="shopping-store" size={22} color="grey" />
                        <Text style={styles.restaurantAddress}>{order.Restaurant.address}</Text>
                    </View>
                    <View style={styles.storeContainer}>
                        <Fontisto name="map-marker-alt" size={22} color="grey" />
                        <Text style={styles.restaurantAddress}>{order.User.address}</Text>
                    </View>
                    <View style={styles.container2}>
                        <Text style={styles.detailsText}>Onion Rings x1</Text>
                        <Text style={styles.detailsText}>Big Mac x3</Text>
                        <Text style={styles.detailsText}>Big Tasty x2</Text>
                        <Text style={styles.detailsText}>Coca cola x1</Text>
                    </View>
                </View>
                <Pressable style={{ ...styles.acceptOrderButton, backgroundColor: isButtonDisabled() ? 'grey' : '#3FC060' }} onPress={onButtonPressed} disabled={isButtonDisabled()} >
                    <Text style={styles.acceptButtonText}>{renderButtonTitle()}</Text>
                </Pressable>
            </BottomSheet>
    );
}

export default BottomSheetDetails;