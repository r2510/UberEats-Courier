import {  Marker } from 'react-native-maps'
import { View, Text } from 'react-native';
import { Entypo, MaterialIcons, Ionicons } from '@expo/vector-icons';

const CustomMarker = ({data, type}) =>{
    return(
        <Marker
        coordinate={{ 
            latitude: data.lat, 
            longitude: data.lng 
        }}
        title={data.name}
        description={data.address}
                >
            <View style={{ backgroundColor: 'green', padding: 5, borderRadius: 5 }}>
            { 
            type === "RESTAURANT" ? 
            <Entypo name="shop" size={25} color='white' /> : (
                <MaterialIcons name="restaurant" size={25} color="white" />
            )}
            </View>
        </Marker>
    );
}
export default CustomMarker;