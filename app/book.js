import React, { Component } from 'react'
import { Button, StyleSheet, Image, TextInput, View, Text, TouchableOpacity, FlatList} from 'react-native'
import StarRating from 'react-native-star-rating';
const BOOK_NORMAL = require('./images/book_normal.png');
const BOOK_SELECT = require('./images/book_selected.png');

var BOOK_URL = 'https://api.douban.com/v2/book/search?tag=文学';
const BOOK_SEARCH = 'https://api.douban.com/v2/book/search?q=';

import  LineDivider  from './lineDivder.js'
import  LoadingView  from './loadingView.js'
import SearchImage from './searchImage.js'



var searchText = null;
var pager = 0;

export default class BookScreen extends Component{

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            refreshing: false
        };
    };

    componentWillMount() {
        this.searchBooks()
    }

    static navigationOptions = ({navigation, screenProps}) => ({
        headerTitle: '书籍',
        headerTitleStyle : {alignSelf:'center'},
        tabBarLabel: 'Book',
        tabBarIcon: (({focused}) =>{
            return (
                <Image source={focused ? BOOK_SELECT:BOOK_NORMAL} style={[styles.icon]}/>
            )
        }),
        headerRight: (
            <SearchImage/>
        )
    });

    render() {
        return(
            <View style={styles.container}>
                {this.renderBooks()}
            </View>
        )
    }

    /**
     * 根据不同状态去渲染不同的数据
     * @returns {XML}
     */
    renderBooks() {
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
                    onPress={() => this.onPressItem()}
                    onRefresh={() => this.searchBooks(BOOK_URL)}
                    refreshing={this.state.refreshing}
                    onEndReachedThreshold={0.1}
                    onEndReached={(info) => this.loadMoreData()}
                    keyExtractor={(item, index) => item.id}
                    ItemSeparatorComponent= { LineDivider }
                    renderItem = {({item, index}) =>
                        <TouchableOpacity onPress={() => this.onPressItem(item, index)}>
                            <View style={styles.listContent}>
                                <Image
                                    style={styles.bookImage}
                                    source={{uri: item.image}}
                                />
                                <View style={styles.listRight}>
                                    <Text numberOfLines={1} style={{fontSize:16, fontWeight:'bold'}}>{item.title}</Text>
                                    <Text numberOfLines={1}>作者：{item.author.join('、')}</Text>
                                    {this.textCheckNull(item.translator.join('、'))}
                                    <Text numberOfLines={1}>价格：{item.price}</Text>
                                    <Text numberOfLines={1}>出版社：{item.publisher}</Text>
                                    <Text numberOfLines={1}>出版日期：{item.pubdate}</Text>
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

    /**
     * item的点击事件
     */
    onPressItem(item, index) {
        const {navigate} = this.props.navigation;
        navigate('BookDetail', {title:item.title, id: item.id})
    }

    /**
     * 搜索图书和刷新数据
     */
    searchBooks() {
        pager = 0;
        if(searchText) {
            BOOK_URL = BOOK_SEARCH + searchText;
        }
        this.setState({
            refreshing: true
        });
        this.fetchData(BOOK_URL);
    }

    /**
     * 加载更多
     */
    loadMoreData() {
        pager += 1;
        let uri = BOOK_URL + `&start=${pager*20}&count=20`;
        this.setState({
            refreshing: true
        });
        this.fetchData(uri);
    }


    /**
     * 验证'译者'是否为空
     * @param translator
     * @returns {*}
     */
    textCheckNull(translator) {
        if(!translator) {
            return null;
        }
        return(
            <Text numberOfLines={1}>译者：{translator}</Text>
        )
    }

    /**
     * 联网请求
     * @param uri
     */
    fetchData(uri) {
        fetch(uri)
            .then((response) => response.json())
            .then((responseJson) => {
            let data;
            if (pager > 0) {
                // 加载更多
                data = this.state.dataSource.concat(responseJson.books)
            }else {
                // 下拉刷新或搜索图书
                data = responseJson.books
            }
                this.setState({
                    dataSource:data,
                    refreshing: false,
                })
            })
            .catch((error) => {
                this.setState({
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
        height: 150,
    },
    listRight: {
        flex: 1,
        marginLeft:5,
        justifyContent:'space-between'
    }
});