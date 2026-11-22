
window.location.replace("/update.html");

/*----*/

        //SNS 공유
        function sendSns(sns, url, txt) {
            var o;
            var _url = window.location;
            var _tits = $('meta[itemprop=name]').attr("content");
            var _txt = $('meta[itemprop=description]').attr("content");
            var _img = $('meta[itemprop=image]').attr("content");
            var _br = encodeURIComponent('\r\n');
            switch (sns) {
                case 'twitter':
                    o = {
                        method: 'popup',
                        url: 'http://twitter.com/intent/tweet?text=' + _txt + '&url=' + _url
                    };
                    break;
                case 'facebook':
                    o = {
                        method: 'popup',
                        url: 'http://www.facebook.com/sharer/sharer.php?u=' + _url
                    };
                    break;
                case 'google':
                    o = {
                        method: 'popup',
                        url: 'https://plus.google.com/share?url=' + _url
                    };
                    break;
                case 'linkedin':
                    o = {
                        method: 'popup',
                        url: 'http://www.linkedin.com/shareArticle?mini=true&url=' + _url + '&summary=' + _txt + '&source=' + _img
                    };
                    break;
                case 'pint':
                    o = {
                        method: 'popup',
                        url: 'https://www.pinterest.com/pin/create/button/?url=' + _url + '&media=' + _img + '&description=' + _txt
                    };
                    break;
                default:
                    alert('지원하지 않는 SNS입니다.');
                    return false;
            }
            switch (o.method) {
                case 'popup':
                    window.open(o.url);
                    break;
            }
        }
    
/*----*/

        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date(); a = s.createElement(o),
                m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
        })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
        ga('create', 'UA-47162325-1', 'auto');
        ga('send', 'pageview');
    
/*----*/
(function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.7";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
/*----*/

        // pc와 동일
        $(".cp a").click(function () {
            var a = $("<input>");
            $("body").append(a);
            a.val(location.href).select();
            document.execCommand("copy");
            a.remove();
            $(".copylink_pop").addClass("showp");
            setTimeout(function () {
                $(".copylink_pop").removeClass("showp")
            }, 1E3)
        });

        gsap.registerPlugin(ScrollTrigger)
        var showroom_videos = document.querySelectorAll('video');

        showroom_videos.forEach(function (video) {
            ScrollTrigger.create({
                trigger: video,
                start: () => 'top 95%',
                end: () => 'bottom 5%',
                onToggle: function (self) {
                    if (self.isActive) {
                        video.play()
                    } else {
                        video.pause()
                    }
                }
            });
        });

        const animation = gsap.utils.toArray('.animate');
        animation.forEach((item, idx) => {
            gsap.from(item, 1.5, {
                y: 50,
                delay: idx * 0.2,
                opacity: 0,
                scrollTrigger: {
                    start: "top bottom",
                    end: "top center",
                    trigger: item,
                }
            })
        });

        var swiper = new Swiper(".mySwiper", {
            slidesPerView: 8,
            spaceBetween: 5,
            loop: true,
            direction: 'horizontal',
            allowTouchMove: false,
            autoplay: {
                delay: 0,
                disableOnInteraction: false,
            },
            speed: 3000,
            loopAdditionalSlides: 2,
        });

    