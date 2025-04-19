<fieldset name=panel_lock>
<legend>блокировать</legend>
%radio("lock", 0, { 0:  " ник" })%<br>
%?%radio("lock", 0, { 1: " прямой IP" })%%IP%<br>?%
%?%radio("lock", 0, { 2: " прокси" })%%PROXY%<br>?%
%?%radio("lock", 0, { 3: " сеть" })% (размер сети %NET%)<br>?%
%?%checkbox("lockc1", 0, 4, " комп (CID1)")%%CID1%<br>?%
%?%checkbox("lockc2", 0, 8, " похожие компы (CID2)")%%CID2%<br>?%
%?%checkbox("locktor", 0, 16, " сеть Tor")%%TOR%<br>?%
</fieldset>
