%MONTHS({
	en: [[
		"January", "February", "March", "April",
		"May", "June", "July", "August",
		"September", "October", "November", "December"
	]]
})%
<tetris-game>
<tetris level-tip="Level %NUM%"></tetris>
<tetris-info>
<tetris-next>Next:</tetris-next>
<tetris-next-piece></tetris-next-piece>
<tetris-record>Record:</tetris-record>
<tetris-score>Score:</tetris-score>
<tetris-lines>Lines:</tetris-lines>
<tetris-level>Level:</tetris-level>
<!--
<tetris-time>Time:</tetris-time>
-->
</tetris-info>
</tetris-game>

<tetris-title>
<div class=title>
<span class=t></span>
<span class=e></span>
<span class=t></span>
<span class=r></span>
<span class=i></span>
<span class=s></span>
</div>
<div class=bottom>
<a name=tetris-continue-game class=continue>Continue the game</a>
<a name=tetris-new-game class=continue>Start a new game</a>
<a name=tetris-new-game>Play the game</a>
</div>
</tetris-title>

<tetris-game-over>
<div class=title>GAME OVER</div>
<tetris-high-score lang=en date-fmt="d mmm" empty=". . . . ."></tetris-high-score>
<div class=bottom>
<a name=tetris-new-game>Play the game</a>
</div>
</tetris-game-over>
