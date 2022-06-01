import L from "leaflet";
import Icon from "../../assets/img/icon.svg";

const IconLocation = L.icon({
    iconUrl: Icon,
    iconRetinaUrl: Icon,
    iconAnchor: null,
    shadowUrl: null,    
    shadowSize: null,
    shadowAnchor: null,
    iconSize: [35, 35],
    className: ""
}) 

export default IconLocation;