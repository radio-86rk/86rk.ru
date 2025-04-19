%ERROR_CFG({
	videorecorder:	"Не удалось запустить видеомагнитофон. %ERROR%"
})%
<video-recorder>
<video-video>
<div>
<video id=webcam></video>
<video id=video></video>
</div>
<video-slider class=track><video-timeline></video-timeline></video-slider>
</video-video>
<video-ctrl>
<video-bttn id=power class=power></video-bttn>
<video-bttn id=play></video-bttn>
<video-bttn id=record></video-bttn>
<video-res>
<select>
<option value="">&#x21f1;&#x21f2;
<option value="320:180" title="(16:9)">320&#215;180
<option value="320:240" title="(4:3)">320&#215;240
<option value="640:360" title="(16:9)">640&#215;360
<option value="640:480" title="(4:3)">640&#215;480
<option value="1024:576" title="(16:9)">1024&#215;576
<option value="1024:768" title="(4:3)">1024&#215;768
<option value="1280:720" title="(16:9)">1280&#215;720
<option value="1920:1080" title="(16:9)">1920&#215;1080
</select>
</video-res>
<video-time id=time></video-time>
<video-time id=dura></video-time>
<video-volume><input type=range value=.58 min=.02 max=1 step=.14></video-volume>
</video-ctrl>
</video-recorder>
