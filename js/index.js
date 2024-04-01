//作用：需要将所有的DOM对象及相关资源全部加载完再进行执行的函数
window.onload = function () {

    //声明一个记录点击的缩略图的下标，目的是实现跨函数的调用（当然，也可以通过传递参数的方式）
    var bigImgIndex = 0;

    // 路径导航的数据渲染
    navPathDataBind();
    function navPathDataBind() {
        /**
         * 思路：
         * 1.先获取路径导航的页面元素（navPath）
         * 2.再来获取所需要的数据（data.js->goodDate.path)
         * 3.由于数据是动态产生的，那么相应的 DOM元素也应该是动态产生的，即需要根据元素的数量来创建 DOM元素
         * 4.注意：在遍历数据创建 DOM元素的最后一条时，应该注意之创建<a>标签，不创建<i>标签
         */

        // 1.获取页面导航元素的对象
        var navPath = document.querySelector('#wrapper #content .contentMain .navPath');
        // console.log(navPath);

        // 2.获取具体数据
        var path = goodDate.path;
        // console.log(path);

        // 3.遍历数据创建元素
        for (var i = 0; i < path.length; i++) {
            if (i == path.length - 1) {
                //最后一个只创建<a>标签，并且<a>没有href属性
                var aNode = document.createElement('a');
                aNode.innerText = path[i].title;

                //让navPath元素追加a和i
                navPath.appendChild(aNode);
            } else {
                // 4.创建<a>标签
                var aNode = document.createElement("a");
                aNode.href = path[i].url;
                aNode.innerText = path[i].title;

                // 5.创建<i>标签
                var iNode = document.createElement('i');
                iNode.innerText = '/';

                // 6.让navPath元素追加a和i
                navPath.appendChild(aNode);
                navPath.appendChild(iNode);
            }
        }
    }

    // 放大镜的移入、移出效果
    bigClassBind();
    function bigClassBind() {
        /**
         * 思路：
         * 1、获取小图框元素对象，并且设置移入事件（onmouseover（会影响父元素，这里不需要）、onmouseenter）
         * 2、动态创建蒙版元素和大图框的图片元素
         * 3、移除（onmouseleave）时需要移除蒙版元素和大图框（大图框移除则大图片也就消失了）
         * 
         */
        // 1.获取小图框元素
        var smallPic = document.getElementById('smallPic');

        // 获取leftTop元素
        var leftTop = document.querySelector('#wrapper #content .contentMain #center #left #leftTop')

        //// 动态获取所展示图的数据————获取整个数组
        var imagessrc = goodDate.imagessrc;

        // 2.设置移入事件
        smallPic.onmouseenter = function () {
            // 3.创建蒙版元素
            var maskDiv = document.createElement('div');
            maskDiv.className = 'mask';

            // 4.创建大图框元素
            var bigPic = document.createElement('div');
            bigPic.id = 'bigPic';

            // 5.创建大图片元素————动态产生的
            var bigImg = document.createElement('img');
            bigImg.src = imagessrc[bigImgIndex].b;

            // 6.小图框追加蒙版元素
            smallPic.appendChild(maskDiv);

            // 7.大图框追加大图片
            bigPic.appendChild(bigImg);

            // 8.leftTop追加大图框
            leftTop.appendChild(bigPic);

            // 10.设置移动事件
            smallPic.onmousemove = function (event) {
                // event.clientX是鼠标点距离浏览器视口最左侧的距离
                // smallPic.getBoundingClientRect().left是小图框元素距离浏览器视口最左侧的距离
                // maskDiv.offsetWidth是蒙版元素占位宽度
                var left = event.clientX - smallPic.getBoundingClientRect().left - maskDiv.offsetWidth / 2;
                var top = event.clientY - smallPic.getBoundingClientRect().top - maskDiv.offsetHeight / 2;

                // 11.限制蒙版元素的位置
                if (left < 0) {
                    left = 0;
                } else if (left > smallPic.clientWidth - maskDiv.offsetWidth) {
                    left = smallPic.clientWidth - maskDiv.offsetWidth;
                }
                if (top < 0) {
                    top = 0;
                } else if (top > smallPic.clientHeight - maskDiv.offsetHeight) {
                    top = smallPic.clientHeight - maskDiv.offsetHeight;
                }

                // 设置left和top属性
                maskDiv.style.left = left + "px";
                maskDiv.style.top = top + "px";

                // 12.完成大图的动态放大效果
                var scale = (smallPic.clientWidth - maskDiv.offsetWidth) / (bigImg.offsetWidth - bigPic.clientWidth);
                // console.log(scale);  // 0.495
                // console.log(smallPic.clientWidth - maskDiv.offsetWidth); // 198
                // console.log(bigImg.offsetWidth - bigPic.clientWidth);   // 400
                // console.log(maskDiv.offsetWidth);    // 包含元素的边框，事实而言，蒙版元素的边框确实也会占据一定的空间
                bigImg.style.left = -left / scale + "px";
                bigImg.style.top = -top / scale + "px";
            }


            // 9.在函数内部设置监听移出函数
            smallPic.onmouseleave = function () {
                // 让smallPic移除蒙版元素
                smallPic.removeChild(maskDiv);

                // 让lefftTop移除大图框
                leftTop.removeChild(bigPic);

                // 不用让大图框移除大图片，因为父元素被移除了，子元素也就没有了
            }

        }
    }

    // 动态渲染放大镜缩略图的数据
    thumbnailData();
    function thumbnailData() {
        /**
         * 思路：
         * 1、首先获取picList元素下的ul
         * 2、再获取data.js的goodData->imagessrc
         * 3、遍历数组，根据数组长度创建li元素
         * 4、最后注意元素的追加
         */
        // 1.首先获取picList元素下的ul
        var ul = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #picList ul');

        // 2.获取imagessrc数据
        var imagessrc = goodDate.imagessrc;

        // 3.遍历数组
        for (var i = 0; i < imagessrc.length; i++) {
            // 4.创建li元素
            var newLi = document.createElement("li");

            // 5.创建img元素
            var newImg = document.createElement("img");
            newImg.src = imagessrc[i].s;

            // 6.让ul追加li元素，然后再让li追加img元素
            ul.appendChild(newLi);
            newLi.appendChild(newImg);

        }

    }

    //点击缩略图的效果
    thumbnailClick();
    function thumbnailClick() {
        /**
         * 思路：
         * 1、获取所有的li元素，并且循环发生点击事件
         * 2、点击缩略图进行替换大图和小图的src，前提是知道下标
         * 
         */
        // 1.获取所有的li元素
        var liNodes = document.querySelectorAll('#wrapper #content .contentMain #center #left #leftBottom #picList ul li');

        // 进行小图的渲染————首先要获取到小图的元素
        var smallPic_img = document.querySelector('#wrapper #content .contentMain #center #left #leftTop #smallPic img');
        // 进行小图的渲染————然后获取到图片的路径数组
        var imagessrc = goodDate.imagessrc;
        // 进行小图的渲染————始终保持小图展示的是数据中的第一张图片
        smallPic_img.src = imagessrc[0].s;

        // 2.循环这些li元素
        for (var i = 0; i < liNodes.length; i++) {
            // 在点击事件发生之前，给每个li添加一个下标
            liNodes[i].index = i;   /** 还可以通过setAttribute('index', i)来进行设置，前者是对创建出的对象的操作，后者是对原数据的操作*/
            liNodes[i].onclick = function () {
                var currentIndex = this.index;   /** 事件函数中的this永远指向实际发生该事件的元素*/
                // 更新大图下标
                bigImgIndex = currentIndex;
                // 更新小图
                smallPic_img.src = imagessrc[currentIndex].s;
            }
        }
    }

    //点击箭头实现缩略图的移动
    thumbnailLeftRightClick();
    function thumbnailLeftRightClick() {
        /**
         * 思路：
         * 1、首先获取两端的箭头
         * 2、再获取可视的div盒子以及ul、li元素
         * 3、注册点击事件
         */

        // 获取两端的箭头元素
        var prev = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom a.prev');
        var next = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom a.next');
        // 获取div盒子，以及ul、li元素

        var ul = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #picList ul')
        var liNodes = document.querySelectorAll('#wrapper #content .contentMain #center #left #leftBottom #picList ul li');

        // 计算
        // 移动的起点
        var start = 0;
        // 步长
        var step = (liNodes[0].offsetWidth + 20) * 2;
        // 最大移动距离
        var extenableLength = (liNodes.length - 5) * step / 2;

        // 注册事件回退
        prev.onclick = function () {
            start -= step;
            if (start < 0) {
                start = 0;
            }
            ul.style.left = -start + "px";
        }
        // 注册前进事件
        next.onclick = function () {
            start += step;
            if (start > extenableLength) {
                start = extenableLength;
            }
            ul.style.left = -start + "px";
        }

    }

    //商品详情的动态渲染
    rightTopData();
    function rightTopData() {
        /**
         * 思路：
         * 1、查找rightTop元素
         * 2、查找data.js->goodData->goodsDetail
         * 3、建立一个字符串变量，将原来的布局结构粘贴过来，然后在需要动态渲染的数据处用EL表达式动态显示
         */
        var rightTop = document.getElementById('rightTop');

        var goodsDetail = goodDate.goodsDetial;

        // 创建字符串变量————单引号、双引号、模板字符串(按照原结构显示换行，使用的是反引号``)
        // 模板字符串替换数据：${变量}
        var str = `<h3>${goodsDetail.title}</h3>
                    <p>${goodsDetail.recommend}</p>
                    <div class="priceWrap">
                        <div class="priceTop">
                            <span>价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</span>
                            <div class="price">
                                <span>￥</span>
                                <p>${goodsDetail.price}</p>
                                <i>降价通知</i>
                            </div>
                            <p>
                                <span>累计评价 </span>
                                <span>666666</span>
                            </p>
                        </div>
                        <div class="priceBottom">
                            <span>促&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</span>
                            <p>
                                <span>${goodsDetail.promoteSales.type}</span>
                                <span>${goodsDetail.promoteSales.content}</span>
                            </p>
                        </div>
                    </div>
                    <div class="support">
                        <span>支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持</span>
                        <p>${goodsDetail.support}</p>
                    </div>
                    <div class="address">
                        <span>配&nbsp;送&nbsp;至</span>
                        <p>${goodsDetail.address}</p>
                    </div>`;

        // 重新渲染rightTop元素(innerHTML可以识别两侧及内部的html标签，而innerText不会识别两侧及内部的标签)
        rightTop.innerHTML = str;


    }

    //商品可选属性的渲染
    rightBottomData();
    function rightBottomData() {
        /**
         * 思路：
         * 1、找到相应的对象(关键是找谁啊，得看数据的存贮形式以及访问方式)————chooseWrap
         * 2、查找data.js->goodData.goodDetail.crumbData数据
         * 3、
         */
        // 1.找到对应的元素
        var chooseWrap = document.getElementById('chooseWrap');
        // 2.获取数据
        var crumbData = goodDate.goodsDetial.crumbData;
        // 3.进行遍历，动态渲染
        for (var i = 0; i < crumbData.length; i++) {
            // 4.创建dl元素
            var dlNode = document.createElement('dl');

            var dtNode = document.createElement('dt');
            dtNode.innerText = crumbData[i].title;

            // 追加元素 dl
            chooseWrap.appendChild(dlNode);
            // 追加元素dt
            dlNode.appendChild(dtNode);

            // 每次都要再次遍历dd
            for (var j = 0; j < crumbData[i].data.length; j++) {
                var ddNode = document.createElement('dd');
                ddNode.innerText = crumbData[i].data[j].type;
                //// 
                ddNode.setAttribute("changePrice", crumbData[i].data[j].changePrice);

                // dd的追加一定要在 dt 之后
                dlNode.appendChild(ddNode);
            }

        }
    }

    //点击商品参数之后的颜色排他效果及产生标记
    clickedBind();
    function clickedBind() {
        /**
         * 思路————实现文字排他的思路
         * 1、获取所有的dl元素，取第一个dl的dd做测试
         * 2、循环所有的dd元素，并添加点击事件
         * 3、确定实际发生时间的目标源对象，然后分别重置颜色
         * ===============================================
         * 
         * 思路————点击 dd元素之后产生 mark标记
         * 1、首先创建一个可以容纳dd元素的值的容器————数组，确定数组的初始长度
         * 2、然后再将点击的dd元素的值按照对应下标来写入到数组元素的身上
         * 3、
         */


        // // 1.获取所有的dl元素
        // var dlNodes = document.querySelectorAll("#wrapper #content .contentMain #center #right #rightBottom #chooseWrap dl");
        // // 1.找第一个dl下的所有dd元素
        // var ddNodes = dlNodes[0].querySelectorAll('dd');
        // // 遍历所有的dd元素
        // for (var i = 0; i < ddNodes.length; i++) {
        //     ddNodes[i].onclick = function () {  // 这里onclick()方法的注册是会跟着对应的i序号进行注册的
        //         // 然而onclick()方法内部的代码，是在整个页面加载之后，再点击才有机会执行，此时i以及遍历结束了，i变为3，所有在内部使用i的时候，都是3
        //         // 首先重置所有的颜色，然后再渲染指定的元素
        //         for (var j = 0; j < ddNodes.length; j++) {
        //             ddNodes[j].style.color = "#666";
        //         }
        //         this.style.color = "red";
        //     }
        // }



        // 获取所有的dl元素
        var dlNodes = document.querySelectorAll("#wrapper #content .contentMain #center #right #rightBottom #chooseWrap dl");

        //// 创建一个数组
        var arr = new Array(dlNodes.length);
        arr.fill(0);

        for (var i = 0; i < dlNodes.length; i++) {
            !function (i) {
                // 找下标为i的dl下的所有dd元素
                var ddNodes = dlNodes[i].querySelectorAll('dd');

                // 遍历所有的dd元素
                for (var j = 0; j < ddNodes.length; j++) {
                    ddNodes[j].onclick = function () {

                        //// 清空choose，保证每次追加后只打印刚才追加的元素
                        choose.innerHTML = '';
                        // 首先重置所有的颜色，然后再渲染指定的元素
                        for (var k = 0; k < ddNodes.length; k++) {
                            ddNodes[k].style.color = "#666";
                        }
                        this.style.color = "red";

                        //// 点击dd元素
                        //// arr[i] = this.innerText;
                        arr[i] = this;

                        //// 刷新价格
                        changePriceBind(arr);

                        //// 遍历arr数组，将非0的元素写入到mark标记，不使用for循环了，就层次太多了
                        arr.forEach(function (value, index) {
                            //// 只要是选择过的内容，就会被创建元素结点
                            if (value) {
                                //// 创建div盒子，并设置class属性、内部文字值
                                var markDiv = document.createElement('div');
                                markDiv.className = "mark";
                                // markDiv.innerText = value;
                                markDiv.innerText = value.innerText;

                                //// 创建a标签，并设置内部文字
                                var aNode = document.createElement('a');
                                aNode.innerText = "X";
                                //// 设置a标签数组的下标
                                aNode.setAttribute("index", index);
                                //// 追加a标签
                                markDiv.appendChild(aNode);
                                //// 追加markDiv标签
                                var choose = document.querySelector('#wrapper #content .contentMain #center #right #rightBottom #choose');
                                choose.appendChild(markDiv);
                            }

                        });

                        //// 获取所有的a标签，并且循环发生点击事件
                        var aNodes = document.querySelectorAll('#wrapper #content .contentMain #center #right #rightBottom #choose .mark a');
                        for (var n = 0; n < aNodes.length; n++) {
                            aNodes[n].onclick = function () {
                                var idx1 = this.getAttribute("index");
                                //// 回复数组中对应下标元素的值
                                arr[idx1] = 0;
                                //// 找到对应下标的那个dl行中所有的dd元素
                                var ddList = dlNodes[idx1].querySelectorAll("dd");

                                //// 遍历所有的dd元素
                                for (var m = 0; m < ddList.length; m++) {
                                    //// 设置所有的dd的文字为初始的灰色
                                    ddList[m].style.color = "#666";
                                }
                                //// 设置第一个dd为红色
                                ddList[0].style.color = "red";
                                //// 删除对应的下标位置的mark标记
                                choose.removeChild(this.parentNode);    // this.parentNode指的是a标签的父元素div(class = "mark"),这个div确实是choose的子元素

                                // 刷新价格
                                changePriceBind(arr);
                            }
                        }
                    }
                }
            }(i)
        }


    }

    // 价格变动的函数声明
    // 封装起来，在上面的函数内部调用，不是一开始就进行调用
    function changePriceBind(arr) {
        /**
         * 思路：
         * 1、获取价格元素标签
         * 2、给每个dd元素加上自定义的属性————改变的价格
         * 3、for 循环遍历数组，价格相加
         * 4、价格渲染
         */
        // 原价格的标签
        var showPrice = document.querySelector('#wrapper #content .contentMain #center #right #rightTop .priceWrap .priceTop .price p');

        var defaultedPrice = goodDate.goodsDetial.price;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i]) {
                var changePrice = Number(arr[i].getAttribute("changePrice"));
                defaultedPrice += changePrice;
            }
        }
        showPrice.innerText = defaultedPrice;

        // 修改下面搭配的初始价格
        var originPrice = document.querySelector('#wrapper #content .contentMain #goodsDetailWrap .rightDetail .chooseBox .listWrap .left p');
        originPrice.innerText = "￥" + defaultedPrice;

        // 修改选择完搭配之后的价格
        var totalPrice = document.querySelector('#wrapper #content .contentMain #goodsDetailWrap .rightDetail .chooseBox .listWrap .right i');
        // 获取复选框类数组对象
        var chooseBoxes = document.querySelectorAll('#wrapper #content .contentMain #goodsDetailWrap .rightDetail .chooseBox .listWrap .middle input');
        for (var m = 0; m < chooseBoxes.length; m++) {
            if (chooseBoxes[m].checked) {
                defaultedPrice += Number(chooseBoxes[m].value);
            }
        }
        totalPrice.innerText = "￥" + defaultedPrice;

    }

    // 选择搭配中间区域复选框选中时，套餐价格变动
    choosePrice();
    function choosePrice() {
        /**
         * 思路：
         * 1、获取这些复选框的元素
         * 2、计算
         * 2、渲染
         */
        // 获取复选框类数组对象
        var chooseBoxes = document.querySelectorAll('#wrapper #content .contentMain #goodsDetailWrap .rightDetail .chooseBox .listWrap .middle input');
        // // 获取原始价格
        // var originPrice = Number(document.querySelector('#wrapper #content .contentMain #goodsDetailWrap .rightDetail .chooseBox .listWrap .left p').innerText.slice(1));
        // var temp = originPrice;
        // 获取套餐价格
        var totalPrice = document.querySelector('#wrapper #content .contentMain #goodsDetailWrap .rightDetail .chooseBox .listWrap .right i');
        // 获取小部件的价格——————document.querySelectorAll（）返回的是 ！！类数组对象！！，不是数组，需要进行类型转换
        var boxesPrice = Array.from(document.querySelectorAll('#wrapper #content .contentMain #goodsDetailWrap .rightDetail .chooseBox .listWrap .middle li div span'));
        // 将类数组对象的转换为数字型数组
        boxesPrice.forEach(function (value, index) {    //foreach循环时，value 参数的类型取决于数组中元素的类型，而且给value赋值不会改变原数组
            var spanContent = value.innerText.slice(1);
            boxesPrice[index] = Number(spanContent);
        });
        // 注册回调函数
        // for (var i = 0; i < chooseBoxes.length; i++) {
        //     chooseBoxes[i].onclick = function () {

        //         for (var j = 0; j < chooseBoxes.length; j++) {
        //             if (chooseBoxes[j].checked) {
        //                 originPrice += boxesPrice[j];
        //             }
        //         }
        //         totalPrice.innerText = " ￥" + originPrice;
        //     }
        // }

        // 代码简化，获取价格与展示的价格可以分开来算
        var originPrice1 = document.querySelector('#wrapper #content .contentMain #goodsDetailWrap .rightDetail .chooseBox .listWrap .left p');

        for (var i = 0; i < chooseBoxes.length; i++) {
            chooseBoxes[i].onclick = function () {
                var originPrice = Number(originPrice1.innerText.slice(1));
                // 获取原始价格
                // var originPrice = Number(document.querySelector('#wrapper #content .contentMain #goodsDetailWrap .rightDetail .chooseBox .listWrap .left p').innerText.slice(1));
                for (var j = 0; j < chooseBoxes.length; j++) {
                    if (chooseBoxes[j].checked) {
                        originPrice = originPrice + Number(chooseBoxes[j].value);
                    }
                }
                totalPrice.innerText = "￥" + originPrice;

            }
        }

    }


    // 封装选项卡方法
    function Tab(tabBtns, tabConts) {
        for (var i = 0; i < tabBtns.length; i++) {
            tabBtns[i].setAttribute("index", i);
            tabBtns[i].onclick = function () {
                for (var j = 0; j < tabBtns.length; j++) {
                    tabBtns[j].className = '';
                    tabConts[j].className = '';
                }
                this.className = "active";
                tabConts[this.getAttribute("index")].className = "active";
            }
        }
    }

    leftTab();
    // 点击左侧选项卡
    function leftTab() {
        var h4s = document.querySelectorAll('#wrapper #content .contentMain #goodsDetailWrap .leftAside .asideTop h4');
        var divs = document.querySelectorAll('#wrapper #content .contentMain #goodsDetailWrap .leftAside .asideContent>div');
        Tab(h4s, divs);
    }


    // 右侧选项卡
    rightTab()
    function rightTab() {
        var lies = document.querySelectorAll('#wrapper #content .contentMain #goodsDetailWrap .rightDetail #bottomDetail .tabBtns li');
        var divs = document.querySelectorAll('#wrapper #content .contentMain #goodsDetailWrap .rightDetail #bottomDetail .tabContents div');
        Tab(lies, divs);
    }


    // 右侧导航栏
    rightNav();
    function rightNav() {
        var aside = document.querySelector('#wrapper .rightAside');
        var btn = document.querySelector('#wrapper .rightAside .btns');
        var flag = true;    // 目前界面是关闭的，变量的初始值不一定与界面统一
        btn.onclick = function () {
            if (flag) {
                aside.className = "rightAside asideClose";
                btn.className = "btns btnsClose";

            } else {
                aside.className = "rightAside asideOpen";
                btn.className = "btns btnsOpen";
            }
            flag = !flag;
        }
    }
}


