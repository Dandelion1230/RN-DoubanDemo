import { TabNavigator  } from 'react-navigation'
import  BookScreen  from './book.js'
import  MovieScreen  from './movie.js'
import  MusicScreen  from './music.js'

const MyApp = TabNavigator({
    Book: {
        screen: BookScreen,
    },
    Movie: {
        screen: MovieScreen,
    },
    Music: {
        screen: MusicScreen,
    },
},{
    tabBarPosition: 'bottom',
    lazy:true,
    tabBarOptions: {
        activeTintColor:'#1296db', // label和icon的前景色 活跃状态下（选中） 。
        inactiveTintColor:'#000000', // label和icon的前景色 不活跃状态下(未选中)。
        showIcon:true, // 是否显示图标，默认关闭。
        upperCaseLabel:false,// 是否使标签大写，默认为true。
        style:{
            backgroundColor:'#FFFFFF',
            height:60
        }, // tabbar的样式。
        indicatorStyle:{
            height:0
        }, // 标签指示器的样式对象（选项卡底部的行）。安卓底部会多出一条线，可以将height设置为0来暂时解决这个问题。
    }
});

export default MyApp;