'use strict';

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TaskSchema = new Schema ( 
    {
      messageId: { type: String }, //"5a7039f16117191e61cea8a6",
      text: { type: String }, //"@/all Weather APP - finished↵[App](https://kaizengami.github.io/kottans_frontend/weather_app/) |  [Repo](https://github.com/kaizengami/Weather_app)↵Підскажіть, будь ласка, як можна покращити код?↵↵Зокрема, в мене зараз є явні помилки з URL API  - міста додаються в адресну строку, при history.back() все працює, як потрібно, але незрозуміло чому зникає можливість зробити history.forward(). Буду дуже вдячний, якщо хтось зможе пояснити)↵Також на мобільній версії чомусь не спрацьовує overflow-x. Виходить, що можна скролити вправо на пусте поле. Там насправді інпут більше 100% із-за дизайну, але все ж хотілося б його сховати за екраном. Доречі, на моб версії список улюблених міст покищо не показується, ще не придумав як краще виводити цей список на смарті.",
      html: { type: String }, //'<p><span data-link-type="groupmention" data-group-name="all" class="groupmention">@/all</span> Weather APP - finished<br><a href="https://kaizengami.github.io/kottans_frontend/weather_app/" rel="nofollow noopener noreferrer" target="_blank" class="link">App</a> |  <a href="https://github.com/kaizengami/Weather_app" rel="nofollow noopener noreferrer" target="_blank" class="link">Repo</a><br>Підскажіть, будь ласка, як можна покращити код?</p><p>Зокрема, в мене зараз є явні помилки з URL API  - міста додаються в адресну строку, при history.back() все працює, як потрібно, але незрозуміло чому зникає можливість зробити history.forward(). Буду дуже вдячний, якщо хтось зможе пояснити)<br>Також на мобільній версії чомусь не спрацьовує overflow-x. Виходить, що можна скролити вправо на пусте поле. Там насправді інпут більше 100% із-за дизайну, але все ж хотілося б його сховати за екраном. Доречі, на моб версії список улюблених міст покищо не показується, ще не придумав як краще виводити цей список на смарті.</p>',
      sent: { type: Date }, //"2018-01-30T09:25:05.327Z",
      userId: { type: String }, //"59f781dbd73408ce4f7c6acb",
      username: { type: String }, //"yevhenorlov",
      displayName: { type: String }, //"yevhen orlov",
      url: { type: String }, //"/yevhenorlov",
      avatarUrl: { type: String }, //"https://avatars-02.gitter.im/gh/uv/4/yevhenorlov",
      avatarUrlSmall: { type: String }, //"https://avatars1.githubusercontent.com/u/17388747?v=4&s=60",
      avatarUrlMedium: { type: String }, //"https://avatars1.githubusercontent.com/u/17388747?v=4&s=128",
      v: { type: Number }, //1,
      gv: { type: String }, //"4"
      readBy: { type: Number }, //46,
      urls: { type: Object },
      mentions: { type: Object },
    } 
  );
  TaskSchema.index( { html: "text" } );

module.exports = mongoose.model('Tasks', TaskSchema);