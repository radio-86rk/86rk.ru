<tetris-game>
<tetris level-tip="Level %NUM%"></tetris>
<tetris-info class=landscape>
<tetris-next class=landscape>Next:</tetris-next>
<tetris-next-piece class=landscape></tetris-next-piece>
<tetris-record class=landscape>Record:</tetris-record>
<tetris-score>Score:</tetris-score>
<tetris-lines>Lines:</tetris-lines>
<tetris-level>Level:</tetris-level>
</tetris-info>
%?%MOBILE_DEVICE%
<tetris-ctrl>
<div ctrl=left>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M0,10L20,0l-5,10l5,10L0,10z"/></svg>
</div>
<div ctrl=down>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10,20L0,0l10,5l10-5L10,20z"/></svg>
</div>
<div ctrl=drop></div>
<div ctrl=rotate>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10,0l10,20l-10-5L0,20L10,0z"/></svg>
</div>
<div ctrl=right>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M20,10L0,20l5-10L0,0L20,10z"/></svg>
</div>
</tetris-ctrl>
?%
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
<a name=tetris-new-game>Play the game</a>
</div>
</tetris-title>

<tetris-game-over>
<div class=title>GAME OVER</div>
<tetris-high-score date-fmt="d mmm"></tetris-high-score>
<div class=bottom>
<a name=tetris-new-game>Play the game</a>
</div>
</tetris-game-over>
