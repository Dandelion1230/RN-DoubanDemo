import React, {Component} from 'react'
import Icon from 'react-native-vector-icons/Ionicons'

export default class SearchImage extends Component {
    render() {
        return(
            <Icon name="ios-search" size={28} color="#000" style={{marginRight:20}}/>
        )
    }
}