import React, { Component } from 'react'
import { Button, StyleSheet, Image, View, TouchableOpacity, TextInput, Text, FlatList } from 'react-native'
import StarRating from 'react-native-star-rating';

const MUSIC_NORMAL = require('./images/music_normal.png');
const MUSIC_SELECT = require('./images/music_selected.png');


const MUSIC_URL = 'https://api.douban.com/v2/music/search?tag=流行音乐';
const MUSIC_SEARCH = 'https://api.douban.com/v2/music/search?q=';

import  LineDivider  from './lineDivder.js'
import  LoadingView  from './loadingView.js'

var searchText = null;

export default class MusicScreen extends Component{

    constructor(props) {
        super(props);
        this.state = {
            dataSource: null,
            loading: false
        };
    };

    static navigationOptions = {
        headerTitle: '音乐',
        headerTitleStyle : {alignSelf:'center'},
        tabBarLabel: 'Music',
        tabBarIcon: ({focused}) =>{
            return(
                <Image source={focused ? MUSIC_SELECT : MUSIC_NORMAL} style={styles.icon}/>
            )
        }
    }

    componentWillMount() {
        this.searchMusics(MUSIC_URL);
    }

    render() {
        return(
            <View style={styles.container}>
                <View style={styles.search}>
                    <TextInput
                        editable={true}
                        maxLength={20}
                        underlineColorAndroid={'transparent'}
                        returnKeyType='search'
                        placeholder={'请输入想要搜索的音乐'}
                        style={styles.input}
                        onChangeText={(text) => searchText=text}
                    />
                    <Button
                        title='搜索'
                        onPress={() =>{this.searchMusics(MUSIC_SELECT+searchText)}}
                    />
                </View>
                {this.renderMusics()}
            </View>
        )
    }

    renderMusics() {
        if(this.state.loading) {
            return(
                <LoadingView/>
            )
        }
        if(!this.state.dataSource) {
            return(
                <View style={{flex:1, justifyContent:'center'}}>
                    <Text style={{alignSelf:'center'}}>
                        暂无内容
                    </Text>
                </View>
            )
        }
        return(
            <View style={styles.list}>
                <FlatList
                    data = {
                        this.state.dataSource
                    }
                    keyExtractor={(item, index) => item.id}
                    ItemSeparatorComponent= { LineDivider }
                    renderItem = {({item, index}) =>
                        <TouchableOpacity onPress={()=>this.onPressItem(item, index)}>
                            <View style={styles.listContent}>
                                <Image
                                    style={styles.bookImage}
                                    source={{uri: item.image}}
                                />
                                <View style={styles.listRight}>
                                    <Text numberOfLines={1} style={{fontSize:16, fontWeight:'bold'}}>{item.title}</Text>
                                    <Text numberOfLines={1}>歌手：{item.author[0].name}</Text>
                                    <Text numberOfLines={1}>发行公司：{item.attrs.publisher}</Text>
                                    <Text numberOfLines={1}>发行日期：{item.attrs.pubdate}</Text>
                                    <View style={{flexDirection:'row'}}>
                                        <StarRating
                                            disabled={true}
                                            maxStars={5}
                                            emptyStar={'ios-star-outline'}
                                            fullStar={'ios-star'}
                                            halfStar={'ios-star-half'}
                                            iconSet={'Ionicons'}
                                            rating={item.rating.average/2}
                                            starColor={'#FABD3B'}
                                            emptyStarColor={'#FABD3B'}
                                            starSize={18}
                                        />
                                        <Text style={{marginLeft:10}}>{item.rating.average}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    }
                />
            </View>
        );
    }

    onPressItem(item, index) {
        const {navigate} = this.props.navigation;
        navigate('MusicDetail', {title:item.title, id: item.id})
    }

    searchMusics(uri) {
        this.setState({
            dataSource:null,
            loading:true
        });
        this.fetchData(uri);
    }

    fetchData(uri) {
        fetch(uri)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    dataSource:responseJson.musics,
                    loading:false
                })
            })
            .catch((error) => {
                this.setState({
                    dataSource:error,
                    loading:false
                })
            });
    }

}

const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    search: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center',
        padding:10,
        paddingBottom:0
    },
    icon: {
        width: 30,
        height: 30,
    },
    input: {
        flex:1,
        borderColor: 'gray',
        borderWidth: 0.5,
        height: 35,
        padding:0,
        paddingLeft:5,
        paddingRight:5,
        fontSize: 16,
        marginRight:5
    },
    list: {
        flex: 1,
        padding: 10,
    },
    listContent: {
        flexDirection:'row',
        backgroundColor:'white',
        borderRadius: 5,
        padding: 10,
    },
    bookImage: {
        width:100,
        height: 120,
    },
    listRight: {
        flex: 1,
        marginLeft:5,
        justifyContent:'space-between'
    }
});