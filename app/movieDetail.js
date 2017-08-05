import React, {Component} from 'react'
import {View, ScrollView, Image, Text, FlatList} from 'react-native'
import StarRating from 'react-native-star-rating';
import  LoadingView  from './loadingView.js'
import  LineDivider  from './lineDivder.js'

const MOVIE_URL='https://api.douban.com/v2/movie/subject/';

var movie_id = null;

export default class MovieDetail extends Component {

    static navigationOptions = ({navigation, screenProps}) => ({
        headerTitle: navigation.state.params.title
    });

    constructor(props) {
        super(props);
        movie_id = this.props.navigation.state.params.id;
        this.state = {
            dataSource: null,
            loading: false,
        }
    }

    componentWillMount() {
        this.getMovieDetailInfo();
    }

    render() {
        if (this.state.loading) {
            return (
                <LoadingView/>
            )
        }
        return(
            <ScrollView>
                <View style={{flex:1, backgroundColor:'white'}}>
                    <View style={{flex:1, backgroundColor: 'orange'}}>
                        <Image
                            style={{width: 150, height: 230, margin:20, alignSelf:'center'}}
                            source={{uri: this.state.dataSource.images.large}}/>
                    </View>
                    <View style={{flex: 1, margin:20}}>
                        <View style={{flex: 1, flexDirection:'row', justifyContent:'space-between'}}>
                            <View>
                                <Text style={{fontSize:20, fontWeight:'bold', color:'black'}}>{this.state.dataSource.title}</Text>
                                <Text>类型：{this.state.dataSource.genres}</Text>
                                <Text>上映时间：{this.state.dataSource.year+'('+this.state.dataSource.countries+')'}</Text>
                                <Text>导演：{this.state.dataSource.directors[0].name}</Text>
                            </View>
                            <View style={{backgroundColor: 'white',alignSelf:'center', padding:10, elevation: 5, alignItems:'center', justifyContent:'center'}}>
                                <Text>豆瓣评分</Text>
                                <Text style={{fontSize:18, fontWeight:'bold', color:'black'}}>{this.state.dataSource.rating.average}</Text>
                                <StarRating
                                    disabled={true}
                                    maxStars={5}
                                    emptyStar={'ios-star-outline'}
                                    fullStar={'ios-star'}
                                    halfStar={'ios-star-half'}
                                    iconSet={'Ionicons'}
                                    rating={this.state.dataSource.rating.average/2}
                                    starColor={'#FABD3B'}
                                    emptyStarColor={'#FABD3B'}
                                    starSize={14}
                                />
                                <Text>{this.state.dataSource.ratings_count}人</Text>
                            </View>
                        </View>
                        <View style={{height:0.5, backgroundColor:'gray', marginTop:20, marginBottom:20}}/>
                        <Text>简介</Text>
                        <Text style={{lineHeight: 30}}>{this.state.dataSource.summary}</Text>
                        <View style={{height:0.5, backgroundColor:'gray', marginTop:20, marginBottom:20}}/>
                        <Text style={{marginBottom: 20}}>影人</Text>
                        <View style={{flex: 1}}>
                            <FlatList
                                data = {
                                    this.state.dataSource.casts
                                }
                                showsHorizontalScrollIndicator = {false}
                                keyExtractor={(item, index) => item.id}
                                ItemSeparatorComponent= { LineDivider }
                                horizontal={true}
                                renderItem ={({item, index}) =>
                                    <View>
                                        <Image
                                            style={{width: 100, height: 150, marginRight:10}}
                                            source={{uri: item.avatars.large}}/>
                                        <Text style={{alignSelf:'center', marginTop:10, fontSize:14, fontWeight: 'bold'}}>{item.name}</Text>
                                    </View>
                                }
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        )
    }

    getMovieDetailInfo() {
        this.setState({
            dataSource:null,
            loading:true
        });
        fetch(MOVIE_URL + movie_id)
            .then((response) => response.json())
            .then((responseJson)=>{
                this.setState({
                    dataSource: responseJson,
                    loading: false,
                })
            })
            .catch((error=>{
                this.setState({
                    dataSource: error,
                    loading: false,
                })
            }))
    }
}