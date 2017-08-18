import React, { Component } from 'react'
import { Button, StyleSheet, Image, View, TouchableOpacity, TextInput, Text, FlatList } from 'react-native'
import StarRating from 'react-native-star-rating';

const MUSIC_NORMAL = require('./images/music_normal.png');
const MUSIC_SELECT = require('./images/music_selected.png');


var MUSIC_URL = 'https://api.douban.com/v2/music/search?tag=流行音乐';
const MUSIC_SEARCH = 'https://api.douban.com/v2/music/search?q=';

import  LineDivider  from './lineDivder.js'
import Icon from 'react-native-vector-icons/Ionicons'
import  LoadingView  from './loadingView.js'


var searchText = null;
var pager = 0;

export default class MusicScreen extends Component{

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            loading: false,
            refreshing: false,
        };
    };

    static navigationOptions = ({navigation}) =>  ({
        headerTitle: '音乐',
        headerTitleStyle : {alignSelf:'center'},
        tabBarLabel: 'Music',
        tabBarIcon: ({focused}) =>{
            return(
                <Image source={focused ? MUSIC_SELECT : MUSIC_NORMAL} style={styles.icon}/>
            )
        },
        headerRight: (
            <Icon name="ios-search" size={28} color="#000" style={{marginRight:20}} onPress={()=>navigation.state.params.navigatePress()}/>
        )
    });

    componentWillMount() {
        this.searchMusics();
    }

    componentDidMount(){
        // 通过在componentDidMount里面设置setParams将title的值动态修改
        this.props.navigation.setParams({
            // headerTitle:'Detail1',
            navigatePress:this.navigatePress,
        });
    }

    navigatePress = () => {
        // alert('点击headerRight');
        const {navigate} = this.props.navigation;
        navigate('Search')
    }

    render() {
        return(
            <View style={styles.container}>
                {/*<View style={styles.search}>
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
                        onPress={() =>{this.searchMusics()}}
                    />
                </View>*/}
                {/*<SearchImage/>*/}
                {this.renderMusics()}
            </View>
        )
    }

    renderMusics() {
        // if(this.state.loading) {
        //     return(
        //         <LoadingView/>
        //     )
        // }
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
                    onRefresh={() => this.searchMusics(MUSIC_URL)}
                    refreshing={this.state.refreshing}
                    onEndReachedThreshold={0.1}
                    onEndReached={(info) => this.loadMoreData()}
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
                                    <Text numberOfLines={1}>歌手：{item.attrs.singer.join('、')}</Text>
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

    searchMusics() {
        pager = 0;
        if(searchText) {
            MUSIC_URL = MUSIC_SEARCH + searchText;
        }
        this.setState({
            refreshing: true,
        });
        this.fetchData(MUSIC_URL);
    }

    loadMoreData() {
        pager += 1;
        MUSIC_URL += `&start=${pager * 20}&count=20`
        this.setState({
            refreshing: true,
        });
        this.fetchData(MUSIC_URL);
    }


    fetchData(uri) {
        fetch(uri)
            .then((response) => response.json())
            .then((responseJson) => {
            let data;
                if (pager > 0) {
                    data = this.state.dataSource.concat(responseJson.musics)
                }else {
                    data = responseJson.musics
                }
                this.setState({
                    dataSource:data,
                    loading:false,
                    refreshing: false,
                })
            })
            .catch((error) => {
                this.setState({
                    dataSource:error,
                    loading:false,
                    refreshing: false,
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