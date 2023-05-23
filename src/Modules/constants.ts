export const json = `["<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<html xml:lang=\"ar\" lang=\"ar\" dir=\"rtl\" xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:epub=\"http://www.idpf.org/2007/ops\">\r\n    <head>\r\n        <meta charset=\"utf-8\"/>\r\n        <meta name=\"viewport\" content=\"initial-scale=2.3, user-scalable=no\"/>\r\n        <title>سجن العمر</title>\r\n        <link rel=\"stylesheet\" type=\"text/css\" href=\"../Style/epub.css\"/>\r\n    </head>\r\n    <body>\r\n        <div dir=\"rtl\">\r\n            <h1 dir=\"rtl\" class=\"title center\"><span n=\"301\">شكر</span> <span n=\"302\">وتقدير</span></h1>\r\n\r\n            <div class=\"paragraph-block\">\r\n                <div class=\"blockquote\" dir=\"rtl\">\r\n                    <p>\r\n                        <span n=\"303\">شكر</span> <span n=\"304\">وتقدير</span> <span n=\"305\">لكل</span>\r\n                        <span n=\"306\">من</span> <span n=\"307\">ساهم</span> <span n=\"308\">في</span>\r\n                        <span n=\"309\">إخراج</span> <span n=\"310\">هذا</span> <span n=\"311\">الكتاب.</span>\r\n                    </p>\r\n                    <div class=\"attribution\">\r\n                        <span><span n=\"312\">المؤلف</span></span>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </body>\r\n</html>\r\n"]`;
export const css = `['@charset "UTF-8";
@font-face {
  font-family: NotoNaskhArabic;
  font-style: normal;
  font-weight: 400;
  src: url(../Fonts/NotoNaskhArabic.ttf);
}
@font-face {
  font-family: NotoNaskhArabic-Bold;
  font-style: normal;
  font-weight: 700;
  src: url(../Fonts/NotoNaskhArabic-Bold.ttf);
}
@font-face {
  font-family: NotoKufiArabic;
  font-style: normal;
  font-weight: 400;
  src: url(../Fonts/NotoKufiArabic.ttf);
}
@font-face {
  font-family: NotoKufiArabic-Bold;
  font-style: normal;
  font-weight: 700;
  src: url(../Fonts/NotoKufiArabic-Bold.ttf);
}
@font-face {
  font-family: Material-Design-Iconic-Font;
  font-style: normal;
  font-weight: 400;
  src: url(../Fonts/Material-Design-Iconic-Font.ttf);
}
@font-face {
  font-family: Quran;
  font-style: normal;
  font-weight: 400;
  src: url(../Fonts/Quran.ttf);
}
body {
  font-family: NotoNaskhArabic, sans-serif !important;
  font-size: 18px;
  font-weight: noraml;
  color: #000;
  overflow-x: hidden;
}
body:after,
body:before {
  content: " ";
  display: table;
}
body:after {
  clear: both;
}
body a,
body button,
body i,
body input {
  text-decoration: none;
  transition: all 0.3s;
}
a,
abbr,
acronym,
address,
applet,
article,
aside,
audio,
b,
big,
blockquote,
body,
canvas,
caption,
center,
cite,
code,
dd,
del,
details,
dfn,
div,
dl,
dt,
em,
embed,
fieldset,
figcaption,
figure,
footer,
form,
h1,
h2,
h3,
h4,
h5,
h6,
header,
hgroup,
html,
i,
iframe,
img,
ins,
kbd,
label,
legend,
li,
mark,
menu,
nav,
object,
ol,
output,
p,
pre,
q,
ruby,
s,
samp,
section,
small,
span,
strike,
strong,
sub,
summary,
sup,
table,
tbody,
td,
tfoot,
th,
thead,
time,
tr,
tt,
u,
ul,
var,
video {
  margin: 0;
  padding: 0;
  border: 0;
  font-weight: inherit;
}
a {
  outline: none;
}
sup {
  display: inline-block;
  position: relative;
  vertical-align: super;
}
sub,
sup {
  font-size: 12px;
}
sub {
  vertical-align: sub;
}
sub span {
  font-size: 12px;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
ol,
ul {
  list-style: none;
}
.itemized_list_ar[dir="ltr"] li,
ul.list[dir="ltr"] li {
  padding-right: 0;
  padding-left: 15px;
}
.itemized_list_ar[dir="ltr"] li:before,
ul.list[dir="ltr"] li:before {
  content: "\f2f6";
  right: auto;
  left: 0;
  line-height: 1;
}
.itemized_list_ar li,
ul.list li {
  display: block;
  position: relative;
  padding-right: 15px;
  line-height: 1.7;
}
.itemized_list_ar li:before,
ul.list li:before {
  content: "\f2f4";
  font-family: Material-Design-Iconic-Font;
  color: #ccc;
  font-size: 24px;
  line-height: 1.3;
  position: absolute;
  right: 0;
  top: 0;
}
.itemized_list_ar li:last-child,
ul.list li:last-child {
  margin-bottom: 0;
}
.itemized_list_ar li.section,
ul.list li.section {
  margin-top: 30px;
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
  font-family: NotoKufiArabic, sans-serif;
  font-size: 17px;
}
.itemized_list_ar li.section:first-child,
ul.list li.section:first-child {
  margin-top: 0;
}
.itemized_list_ar li.section:before,
.itemized_list_ar li.section a,
ul.list li.section:before,
ul.list li.section a {
  color: #ff7a4f;
}
.itemized_list_ar li.sub-book,
ul.list li.sub-book {
  margin-top: 30px;
  margin-bottom: 10px;
  font-family: NotoKufiArabic, sans-serif;
  font-size: 20px;
  padding-right: 0;
}
.itemized_list_ar li.sub-book:first-child,
ul.list li.sub-book:first-child {
  margin-top: 0;
}
.itemized_list_ar li.sub-book:before,
ul.list li.sub-book:before {
  display: none;
}
.itemized_list_ar li.sub-book li,
ul.list li.sub-book li {
  font-family: NotoNaskhArabic, sans-serif;
  font-size: 18px;
}
.itemized_list_ar li.sub-book li.section,
ul.list li.sub-book li.section {
  margin-top: 30px;
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
  font-family: NotoKufiArabic, sans-serif;
  font-size: 17px;
}
.itemized_list_ar li.sub-book li.section:first-child,
ul.list li.sub-book li.section:first-child {
  margin-top: 20px;
}
.itemized_list_ar li a,
ul.list li a {
  color: #707805;
  display: inline;
}
.itemized_list_ar li a:hover,
ul.list li a:hover {
  text-decoration: underline;
}
img {
  font-size: 0;
  color: #fff;
  max-width: 100%;
  height: auto;
  display: inline-block;
  vertical-align: middle;
}
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
main,
menu,
nav,
section,
summary {
  display: block;
}
b {
  font-weight: 700;
}
i {
  font-style: italic;
}
a {
  color: #ff7a4f;
}
a:hover {
  text-decoration: underline;
}
sup a {
  color: #ff7a4f;
}
.epigraph {
  margin-top: 15px;
  margin-bottom: 15px;
}
.epigraph:last-child {
  margin-bottom: 0;
}
.para_flushleft {
  margin: 15px 0;
}
.section {
  margin-top: 60px;
  margin-bottom: 60px;
}
.section:first-child {
  margin-top: 0;
}
.section:last-child {
  margin-bottom: 0;
}
.section > .section {
  margin-top: 20px;
  margin-bottom: 0;
}
.section p:last-child {
  margin-bottom: 0;
}
.section > .subtitle {
  text-align: right;
  margin-bottom: 10px;
  font-size: 22px;
}
.section > .subtitle.center {
  text-align: center;
}
.Ref-Section {
  margin-top: 60px;
}
.dialogue,
.paragraph-block,
p {
  margin-bottom: 15px;
  margin-top: 15px;
  text-align: justify;
}
.dialogue .list,
.dialogue > .paragraph-block,
.paragraph-block .list,
.paragraph-block > .paragraph-block,
p .list,
p > .paragraph-block {
  margin-top: 15px;
}
.dialogue b + b,
.dialogue b + span + b {
  margin-right: -3px;
}
.dialogue {
  margin-top: 15px;
}
.dialogue:last-child {
  margin-bottom: 0;
}
.dialogue p {
  margin: 15px 0;
}
.dialogue p:first-child {
  margin-top: 0;
}
h4 {
  margin-top: 10px;
  margin-bottom: 10px;
  line-height: 1.5;
}
h4,
h4 > span,
h4 > span[dir="ltr"],
h4[dir="ltr"] {
  font-size: 26px;
}
h4[dir="ltr"] sub {
  vertical-align: sub;
  font-size: 12px;
}
h4[dir="ltr"] sub span {
  font-size: 12px;
}
h1 sup,
h2 sup,
h3 sup,
h4 sup,
h5 sup {
  top: -1.2em;
}
h2 {
  font-size: 30px;
}
h2,
h3 {
  margin-bottom: 10px;
}
h3 {
  font-size: 24px;
}
.title {
  margin-bottom: 15px;
  font-size: 22px;
  margin-top: 40px;
}
.title + .subtitle {
  margin-top: -10px;
}
.title [dir="ltr"] {
  font-size: inherit;
}
.center,
.centerborder-bottom,
.centerborder-bottom p,
.center p {
  text-align: center;
}
h1 {
  font-family: NotoKufiArabic, sans-serif;
  font-size: 24px;
  margin-bottom: 30px;
  color: #ff7a4f;
}
h1 sup {
  top: -1em;
}
[dir="ltr"] {
  font-family: Noto Sans, sans-serif;
  font-size: 16px;
}
[dir="ltr"] sub {
  vertical-align: sub;
}
[dir="ltr"] sub,
[dir="ltr"] sub span {
  font-size: 12px;
}
.table-wrapper,
.tablegroup {
  max-width: 100%;
  overflow-x: auto;
  margin: 30px 0;
}
.table-wrapper .table_caption,
.tablegroup .table_caption {
  text-align: center;
  color: #666;
  background-color: #fff;
  padding: 0;
  margin: 0 0 10px;
}
.table-wrapper table,
.tablegroup table {
  width: 100%;
}
.table-wrapper table th,
.tablegroup table th {
  text-align: center;
}
.table-wrapper table tfoot,
.table-wrapper table thead,
.tablegroup table tfoot,
.tablegroup table thead {
  background-color: #fafafa;
}
.table-wrapper table td.border-bottom,
.table-wrapper table tr.border-bottom,
.tablegroup table td.border-bottom,
.tablegroup table tr.border-bottom {
  border-bottom: 2px solid #999;
}
.table-wrapper table td,
.table-wrapper table th,
.tablegroup table td,
.tablegroup table th {
  padding: 5px 15px;
  border: 1px solid #ccc;
}
.table-wrapper table .right,
.tablegroup table .right {
  text-align: right;
}
.table-wrapper table .left,
.tablegroup table .left {
  text-align: left;
}
.table-wrapper > div,
.tablegroup > div {
  background-color: #fafafa;
  padding: 10px;
  color: #666;
  margin-top: 10px;
}
.footnote {
  margin-bottom: 15px;
  text-align: justify;
}
.footnote > div:first-child {
  display: inline;
}
.footnote .list {
  margin-top: 15px;
}
h4.bridge_head_title {
  margin-top: 20px;
}
.poetry_container {
  margin: 1em auto;
  overflow: auto;
  width: 100%;
  display: block !important;
  text-rendering: optimizespeed !important;
  line-height: 1.8em;
}
.poetry_container > div {
  margin-bottom: 0;
}
.poetry_container > h4.title {
  text-align: center;
}
.poetry_container > h4.title.bridge_head_title {
  font-size: 18px;
}
.poetry_container.line > div {
  clear: both;
  overflow: visible;
  text-align: center;
}
.poetry_container.line > div.center {
  width: 100%;
}
.poetry_container.line > div > div {
  min-width: 45%;
  text-align: left;
  line-height: 2em;
  display: inline-block;
  padding: 0 10px;
}
.poetry_container.line > div > div:first-child {
  float: none;
  text-align: left !important;
}
.poetry_container.line > div > div:last-child {
  float: none;
  text-align: right;
}
.poetry_container.line > div > div > bdo {
  width: auto;
  float: none;
}
.peotry_one_line div {
  min-width: inherit !important;
}
.mediaobject,
.subfigure {
  margin: 40px 0;
  text-align: center;
}
.mediaobject .caption-text,
.subfigure .caption-text {
  text-align: center;
  margin-top: 10px;
  color: #666;
  margin-left: auto;
  margin-right: auto;
  width: auto;
  max-width: 70%;
}
@media (max-width: 830px) {
  .mediaobject .caption-text,
  .subfigure .caption-text {
    width: 100%;
  }
}
.mediaobject .caption-text p,
.subfigure .caption-text p {
  text-align: center;
  margin: 0;
}
.note_warning {
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 15px;
  position: relative;
  margin-top: 20px;
  margin-bottom: 20px;
}
.note_warning .para_flushleft {
  font-size: medium;
}
.note_warning .blockquote {
  margin: 0;
}
.note_warning .paragraph-block:first-child,
.note_warning h4:first-child,
.note_warning p:first-child {
  margin-top: 0;
}
.note_warning .paragraph-block:last-child,
.note_warning p:last-child {
  margin-bottom: 0;
}
.blockquote,
.epigraph {
  background-color: #f5f5f5;
  padding: 15px 30px 15px 15px;
  position: relative;
  margin-top: 20px;
  margin-bottom: 15px;
}
.blockquote.center,
.blockquote.center .paragraph-block,
.blockquote.center p,
.epigraph.center,
.epigraph.center .paragraph-block,
.epigraph.center p {
  text-align: center;
}
.blockquote p:last-child,
.epigraph p:last-child {
  margin-bottom: 0;
}
.blockquote .paragraph-block:first-child,
.epigraph .paragraph-block:first-child {
  margin-top: 0;
}
.blockquote .attribution,
.epigraph .attribution {
  text-align: left;
  margin-top: 10px;
}
.blockquote .attribution + .attribution,
.epigraph .attribution + .attribution {
  margin-top: 0;
}
.blockquote .attribution[dir="rtl"],
.epigraph .attribution[dir="rtl"] {
  text-align: right;
}
.blockquote .attribution[dir="ltr"],
.epigraph .attribution[dir="ltr"] {
  font-family: NotoNaskhArabic, sans-serif;
  font-size: 18px;
  font-weight: 400;
}
.blockquote .paragraph-block:last-child,
.epigraph .paragraph-block:last-child {
  margin-bottom: 0;
}
.align_left {
  text-align: left;
}
span.align_left[dir="ltr"] {
  display: block;
}
.list {
  margin-bottom: 15px;
}
.list[dir="ltr"] {
  text-align: left;
}
.list[dir="ltr"] .paragraph-block {
  text-align: justify;
}
.list[dir="ltr"] sub {
  vertical-align: sub;
  font-size: 12px;
}
.list[dir="ltr"] sub span {
  font-size: 12px;
}
.list li {
  text-align: justify;
}
.list li,
.ordered_list li {
  margin-bottom: 15px;
}
.ordered_list li p {
  margin-bottom: 0;
}
.ordered_list li .list li:before {
  color: #888;
}
.ordered_list li .ordered_list_number {
  display: inline-block;
  padding-left: 5px;
}
.ordered_list li .ordered_list_number + .paragraph-block,
.ordered_list li .ordered_list_number + p {
  display: inline;
}
.ordered_list[dir="ltr"] li .ordered_list_number {
  display: inline-block;
  padding-left: 0;
  padding-right: 5px;
}
.itemized_list_ar[dir="ltr"] li {
  padding-right: 0;
  padding-left: 15px;
}
.itemized_list_ar[dir="ltr"] li:before {
  content: "\f2f6";
  right: auto;
  left: 0;
  line-height: 1;
}
.itemized_list_ar li {
  display: block;
  position: relative;
  padding-right: 15px;
  line-height: 1.7;
}
.itemized_list_ar li:before {
  content: "\f2f4";
  font-family: Material-Design-Iconic-Font;
  color: #888;
  font-size: 24px !important;
  line-height: 1.3;
  position: absolute;
  right: 0;
  top: 0;
}
.itemized_list_ar li:last-child {
  margin-bottom: 0;
}
.itemized_list_ar li.section {
  margin-top: 30px;
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
  font-family: NotoKufiArabic, sans-serif;
  font-size: 17px !important;
}
.itemized_list_ar li.section:first-child {
  margin-top: 0;
}
.itemized_list_ar li.section:before,
.itemized_list_ar li.section a {
  color: #ff7a4f;
}
.itemized_list_ar li.sub-book {
  margin-top: 30px;
  margin-bottom: 10px;
  font-family: NotoKufiArabic, sans-serif;
  font-size: 20px !important;
  padding-right: 0;
}
.itemized_list_ar li.sub-book:first-child {
  margin-top: 0;
}
.itemized_list_ar li.sub-book:before {
  display: none;
}
.itemized_list_ar li.sub-book li {
  font-family: NotoNaskhArabic, sans-serif !important;
  font-size: 18px !important;
}
.itemized_list_ar li.sub-book li.section {
  margin-top: 30px;
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
  font-family: NotoKufiArabic, sans-serif;
  font-size: 17px !important;
}
.itemized_list_ar li.sub-book li.section:first-child {
  margin-top: 20px;
}
.itemized_list_ar li a {
  color: #ff7a4f;
  display: inline;
}
.itemized_list_ar li a:hover {
  text-decoration: underline;
}
.itemized_list_ar .paragraph-block:last-child {
  margin-bottom: 0;
}
ul.list li a {
  color: #ff7a4f;
}
.itemized_list_ar.itemized_list_bullet li,
.itemized_list_bullet li {
  margin-bottom: 5px;
}
.itemized_list_ar.itemized_list_bullet li:before,
.itemized_list_bullet li:before {
  content: "";
  width: 5px;
  height: 5px;
  background: #ccc;
  border-radius: 50%;
  margin-left: 10px;
  top: 11px;
}
.itemized_list_ar.itemized_list_bullet[dir="ltr"] li:before,
.itemized_list_bullet[dir="ltr"] li:before {
  margin-left: 0;
  margin-right: 10px;
}
.footnote_line {
  display: block;
  margin: 30px 0;
}
.footnote_line:before {
  content: "";
  display: block;
  width: 40%;
  height: 1px;
  background-color: #ccc;
}
.subtitle {
  text-align: center;
  margin-bottom: 30px;
  font-size: 22px;
}
.external-link {
  word-break: break-all;
}
.equation {
  display: block;
  text-align: center;
  margin: 20px 0;
  position: relative;
}
.equation .equation-number {
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -12px;
}
.paragraph-block span.align_left:only-child[dir="ltr"] {
  display: block;
}
.quran {
  display: inline;
  text-align: right;
  float: none;
  position: relative;
}
.quran:before {
  content: "﴿";
}
.quran:after,
.quran:before {
  font-family: Quran;
  display: inline;
}
.quran:after {
  content: "﴾";
}
.blockquote .blockquote,
.bridge_head_center {
  margin: 0;
}
.paragraph-block .question:first-child {
  margin-top: 10px;
}
.foreignphrase bdo {
  display: block;
}
.o_link_break {
  word-break: break-all;
}
html {
  height: calc(100% - 10px);
}
body {
  height: calc(100% - 40px);
  padding: 20px 15px;
}
.fp {
  min-height: 100%;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
}
.fp,
.fp .title {
  text-align: center;
}
.fp .author {
  font-size: 1.2em;
  margin: 2em auto;
  font-weight: 700;
}
.fp .subtitle {
  font-weight: 700;
  margin-bottom: 2em;
  text-align: center;
}
.fp p {
  line-height: 1.5em;
  margin-bottom: 3em;
}
.fp .logos {
  margin-top: auto;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -ms-flex-align: center;
  align-items: center;
}
.fp .hindawilogo {
  margin: 0 auto;
  height: 100px;
  background-image: url(../Images/hindawi_logo.svg);
  background-repeat: no-repeat;
  background-color: #fff;
  background-position: 50%;
  background-size: 70px;
  overflow: auto;
  width: 100%;
  -ms-flex: 1;
  flex: 1;
}
.fp .hindawilogo:not(:only-child) {
  background-position: 100%;
}
.fp .secondLogo {
  -ms-flex: 1;
  flex: 1;
  width: 100%;
  text-align: left;
  height: 100px;
  background-image: url(../Images/minbaralhurriyaLogo.svg);
  background-repeat: no-repeat;
  background-color: #fff;
  background-position: 0;
  background-size: 85px;
  overflow: auto;
}
.copyright .header {
  margin-bottom: 4em;
  float: left;
  width: 100%;
}
.copyright .header > div {
  width: 100%;
  float: right;
}
.copyright .header > div h2 {
  padding: 0.2em 0.5em;
  border-right: 5px solid #000;
  font-size: 24px;
  float: right;
  width: 43%;
  font-weight: 700;
  line-height: 1;
}
.copyright .header > div h2:nth-child(2) {
  float: left;
  border: 0;
  text-align: left;
  padding-left: 0;
}
.copyright .header > div h3 {
  font-weight: 400;
  width: 50%;
  float: right;
  margin: 0;
  font-size: 20px;
}
.copyright .header > div h3:nth-child(2) {
  float: left;
  text-align: left;
}
.copyright .copyright-content {
  border-right: 1px solid #000;
  margin: 0;
  padding: 1em 2em 0 0;
  font-size: 0.8em;
}
.copyright .copyright-content p {
  line-height: 1.4em;
}
.copyright .copyright-content p:first-of-type {
  margin-top: 0 !important;
}
.copyright .copyright-content .left {
  font-family: Constantia, Lucida Bright, DejaVu Serif, Georgia, serif;
  margin-bottom: 0;
}
.copyright [dir="ltr"] {
  font-family: inherit;
  font-size: inherit !important;
}
.copyright [dir="ltr"] sub {
  vertical-align: sub;
}
.copyright [dir="ltr"] sub,
.copyright [dir="ltr"] sub span {
  font-size: inherit !important;
}
.cf:after,
.cf:before {
  content: " ";
  display: table;
}
.cf:after {
  clear: both;
}
.m_b_12 {
  margin-bottom: 15px;
}
.dialogue b + b,
.dialogue b + span + b {
  margin-right: 0;
}
.shaker {
  font-family: NotoNaskhArabic-Bold;
}
.shaker2 {
  font-family: NotoKufiArabic-Bold;
}
', '@charset "UTF-8";
@font-face {
  font-family: NotoNaskhArabic;
  font-style: normal;
  font-weight: 400;
  src: url(../Fonts/NotoNaskhArabic.ttf);
}
@font-face {
  font-family: NotoNaskhArabic-Bold;
  font-style: normal;
  font-weight: 700;
  src: url(../Fonts/NotoNaskhArabic-Bold.ttf);
}
@font-face {
  font-family: NotoKufiArabic;
  font-style: normal;
  font-weight: 400;
  src: url(../Fonts/NotoKufiArabic.ttf);
}
@font-face {
  font-family: NotoKufiArabic-Bold;
  font-style: normal;
  font-weight: 700;
  src: url(../Fonts/NotoKufiArabic-Bold.ttf);
}
@font-face {
  font-family: Material-Design-Iconic-Font;
  font-style: normal;
  font-weight: 400;
  src: url(../Fonts/Material-Design-Iconic-Font.ttf);
}
@font-face {
  font-family: Quran;
  font-style: normal;
  font-weight: 400;
  src: url(../Fonts/Quran.ttf);
}
body {
  font-family: NotoNaskhArabic, sans-serif !important;
  font-size: 18px;
  font-weight: noraml;
  color: #000;
  overflow-x: hidden;
}
body:after,
body:before {
  content: " ";
  display: table;
}
body:after {
  clear: both;
}
body a,
body button,
body i,
body input {
  text-decoration: none;
  transition: all 0.3s;
}
a,
abbr,
acronym,
address,
applet,
article,
aside,
audio,
b,
big,
blockquote,
body,
canvas,
caption,
center,
cite,
code,
dd,
del,
details,
dfn,
div,
dl,
dt,
em,
embed,
fieldset,
figcaption,
figure,
footer,
form,
h1,
h2,
h3,
h4,
h5,
h6,
header,
hgroup,
html,
i,
iframe,
img,
ins,
kbd,
label,
legend,
li,
mark,
menu,
nav,
object,
ol,
output,
p,
pre,
q,
ruby,
s,
samp,
section,
small,
span,
strike,
strong,
sub,
summary,
sup,
table,
tbody,
td,
tfoot,
th,
thead,
time,
tr,
tt,
u,
ul,
var,
video {
  margin: 0;
  padding: 0;
  border: 0;
  font-weight: inherit;
}
a {
  outline: none;
}
sup {
  display: inline-block;
  position: relative;
  vertical-align: super;
}
sub,
sup {
  font-size: 12px;
}
sub {
  vertical-align: sub;
}
sub span {
  font-size: 12px;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
ol,
ul {
  list-style: none;
}
.itemized_list_ar[dir="ltr"] li,
ul.list[dir="ltr"] li {
  padding-right: 0;
  padding-left: 15px;
}
.itemized_list_ar[dir="ltr"] li:before,
ul.list[dir="ltr"] li:before {
  content: "\f2f6";
  right: auto;
  left: 0;
  line-height: 1;
}
.itemized_list_ar li,
ul.list li {
  display: block;
  position: relative;
  padding-right: 15px;
  line-height: 1.7;
}
.itemized_list_ar li:before,
ul.list li:before {
  content: "\f2f4";
  font-family: Material-Design-Iconic-Font;
  color: #ccc;
  font-size: 24px;
  line-height: 1.3;
  position: absolute;
  right: 0;
  top: 0;
}
.itemized_list_ar li:last-child,
ul.list li:last-child {
  margin-bottom: 0;
}
.itemized_list_ar li.section,
ul.list li.section {
  margin-top: 30px;
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
  font-family: NotoKufiArabic, sans-serif;
  font-size: 17px;
}
.itemized_list_ar li.section:first-child,
ul.list li.section:first-child {
  margin-top: 0;
}
.itemized_list_ar li.section:before,
.itemized_list_ar li.section a,
ul.list li.section:before,
ul.list li.section a {
  color: #ff7a4f;
}
.itemized_list_ar li.sub-book,
ul.list li.sub-book {
  margin-top: 30px;
  margin-bottom: 10px;
  font-family: NotoKufiArabic, sans-serif;
  font-size: 20px;
  padding-right: 0;
}
.itemized_list_ar li.sub-book:first-child,
ul.list li.sub-book:first-child {
  margin-top: 0;
}
.itemized_list_ar li.sub-book:before,
ul.list li.sub-book:before {
  display: none;
}
.itemized_list_ar li.sub-book li,
ul.list li.sub-book li {
  font-family: NotoNaskhArabic, sans-serif;
  font-size: 18px;
}
.itemized_list_ar li.sub-book li.section,
ul.list li.sub-book li.section {
  margin-top: 30px;
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
  font-family: NotoKufiArabic, sans-serif;
  font-size: 17px;
}
.itemized_list_ar li.sub-book li.section:first-child,
ul.list li.sub-book li.section:first-child {
  margin-top: 20px;
}
.itemized_list_ar li a,
ul.list li a {
  color: #707805;
  display: inline;
}
.itemized_list_ar li a:hover,
ul.list li a:hover {
  text-decoration: underline;
}
img {
  font-size: 0;
  color: #fff;
  max-width: 100%;
  height: auto;
  display: inline-block;
  vertical-align: middle;
}
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
main,
menu,
nav,
section,
summary {
  display: block;
}
b {
  font-weight: 700;
}
i {
  font-style: italic;
}
a {
  color: #ff7a4f;
}
a:hover {
  text-decoration: underline;
}
sup a {
  color: #ff7a4f;
}
.epigraph {
  margin-top: 15px;
  margin-bottom: 15px;
}
.epigraph:last-child {
  margin-bottom: 0;
}
.para_flushleft {
  margin: 15px 0;
}
.section {
  margin-top: 60px;
  margin-bottom: 60px;
}
.section:first-child {
  margin-top: 0;
}
.section:last-child {
  margin-bottom: 0;
}
.section > .section {
  margin-top: 20px;
  margin-bottom: 0;
}
.section p:last-child {
  margin-bottom: 0;
}
.section > .subtitle {
  text-align: right;
  margin-bottom: 10px;
  font-size: 22px;
}
.section > .subtitle.center {
  text-align: center;
}
.Ref-Section {
  margin-top: 60px;
}
.dialogue,
.paragraph-block,
p {
  margin-bottom: 15px;
  margin-top: 15px;
  text-align: justify;
}
.dialogue .list,
.dialogue > .paragraph-block,
.paragraph-block .list,
.paragraph-block > .paragraph-block,
p .list,
p > .paragraph-block {
  margin-top: 15px;
}
.dialogue b + b,
.dialogue b + span + b {
  margin-right: -3px;
}
.dialogue {
  margin-top: 15px;
}
.dialogue:last-child {
  margin-bottom: 0;
}
.dialogue p {
  margin: 15px 0;
}
.dialogue p:first-child {
  margin-top: 0;
}
h4 {
  margin-top: 10px;
  margin-bottom: 10px;
  line-height: 1.5;
}
h4,
h4 > span,
h4 > span[dir="ltr"],
h4[dir="ltr"] {
  font-size: 26px;
}
h4[dir="ltr"] sub {
  vertical-align: sub;
  font-size: 12px;
}
h4[dir="ltr"] sub span {
  font-size: 12px;
}
h1 sup,
h2 sup,
h3 sup,
h4 sup,
h5 sup {
  top: -1.2em;
}
h2 {
  font-size: 30px;
}
h2,
h3 {
  margin-bottom: 10px;
}
h3 {
  font-size: 24px;
}
.title {
  margin-bottom: 15px;
  font-size: 22px;
  margin-top: 40px;
}
.title + .subtitle {
  margin-top: -10px;
}
.title [dir="ltr"] {
  font-size: inherit;
}
.center,
.centerborder-bottom,
.centerborder-bottom p,
.center p {
  text-align: center;
}
h1 {
  font-family: NotoKufiArabic, sans-serif;
  font-size: 24px;
  margin-bottom: 30px;
  color: #ff7a4f;
}
h1 sup {
  top: -1em;
}
[dir="ltr"] {
  font-family: Noto Sans, sans-serif;
  font-size: 16px;
}
[dir="ltr"] sub {
  vertical-align: sub;
}
[dir="ltr"] sub,
[dir="ltr"] sub span {
  font-size: 12px;
}
.table-wrapper,
.tablegroup {
  max-width: 100%;
  overflow-x: auto;
  margin: 30px 0;
}
.table-wrapper .table_caption,
.tablegroup .table_caption {
  text-align: center;
  color: #666;
  background-color: #fff;
  padding: 0;
  margin: 0 0 10px;
}
.table-wrapper table,
.tablegroup table {
  width: 100%;
}
.table-wrapper table th,
.tablegroup table th {
  text-align: center;
}
.table-wrapper table tfoot,
.table-wrapper table thead,
.tablegroup table tfoot,
.tablegroup table thead {
  background-color: #fafafa;
}
.table-wrapper table td.border-bottom,
.table-wrapper table tr.border-bottom,
.tablegroup table td.border-bottom,
.tablegroup table tr.border-bottom {
  border-bottom: 2px solid #999;
}
.table-wrapper table td,
.table-wrapper table th,
.tablegroup table td,
.tablegroup table th {
  padding: 5px 15px;
  border: 1px solid #ccc;
}
.table-wrapper table .right,
.tablegroup table .right {
  text-align: right;
}
.table-wrapper table .left,
.tablegroup table .left {
  text-align: left;
}
.table-wrapper > div,
.tablegroup > div {
  background-color: #fafafa;
  padding: 10px;
  color: #666;
  margin-top: 10px;
}
.footnote {
  margin-bottom: 15px;
  text-align: justify;
}
.footnote > div:first-child {
  display: inline;
}
.footnote .list {
  margin-top: 15px;
}
h4.bridge_head_title {
  margin-top: 20px;
}
.poetry_container {
  margin: 1em auto;
  overflow: auto;
  width: 100%;
  display: block !important;
  text-rendering: optimizespeed !important;
  line-height: 1.8em;
}
.poetry_container > div {
  margin-bottom: 0;
}
.poetry_container > h4.title {
  text-align: center;
}
.poetry_container > h4.title.bridge_head_title {
  font-size: 18px;
}
.poetry_container.line > div {
  clear: both;
  overflow: visible;
  text-align: center;
}
.poetry_container.line > div.center {
  width: 100%;
}
.poetry_container.line > div > div {
  min-width: 45%;
  text-align: left;
  line-height: 2em;
  display: inline-block;
  padding: 0 10px;
}
.poetry_container.line > div > div:first-child {
  float: none;
  text-align: left !important;
}
.poetry_container.line > div > div:last-child {
  float: none;
  text-align: right;
}
.poetry_container.line > div > div > bdo {
  width: auto;
  float: none;
}
.peotry_one_line div {
  min-width: inherit !important;
}
.mediaobject,
.subfigure {
  margin: 40px 0;
  text-align: center;
}
.mediaobject .caption-text,
.subfigure .caption-text {
  text-align: center;
  margin-top: 10px;
  color: #666;
  margin-left: auto;
  margin-right: auto;
  width: auto;
  max-width: 70%;
}
@media (max-width: 830px) {
  .mediaobject .caption-text,
  .subfigure .caption-text {
    width: 100%;
  }
}
.mediaobject .caption-text p,
.subfigure .caption-text p {
  text-align: center;
  margin: 0;
}
.note_warning {
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 15px;
  position: relative;
  margin-top: 20px;
  margin-bottom: 20px;
}
.note_warning .para_flushleft {
  font-size: medium;
}
.note_warning .blockquote {
  margin: 0;
}
.note_warning .paragraph-block:first-child,
.note_warning h4:first-child,
.note_warning p:first-child {
  margin-top: 0;
}
.note_warning .paragraph-block:last-child,
.note_warning p:last-child {
  margin-bottom: 0;
}
.blockquote,
.epigraph {
  background-color: #f5f5f5;
  padding: 15px 30px 15px 15px;
  position: relative;
  margin-top: 20px;
  margin-bottom: 15px;
}
.blockquote.center,
.blockquote.center .paragraph-block,
.blockquote.center p,
.epigraph.center,
.epigraph.center .paragraph-block,
.epigraph.center p {
  text-align: center;
}
.blockquote p:last-child,
.epigraph p:last-child {
  margin-bottom: 0;
}
.blockquote .paragraph-block:first-child,
.epigraph .paragraph-block:first-child {
  margin-top: 0;
}
.blockquote .attribution,
.epigraph .attribution {
  text-align: left;
  margin-top: 10px;
}
.blockquote .attribution + .attribution,
.epigraph .attribution + .attribution {
  margin-top: 0;
}
.blockquote .attribution[dir="rtl"],
.epigraph .attribution[dir="rtl"] {
  text-align: right;
}
.blockquote .attribution[dir="ltr"],
.epigraph .attribution[dir="ltr"] {
  font-family: NotoNaskhArabic, sans-serif;
  font-size: 18px;
  font-weight: 400;
}
.blockquote .paragraph-block:last-child,
.epigraph .paragraph-block:last-child {
  margin-bottom: 0;
}
.align_left {
  text-align: left;
}
span.align_left[dir="ltr"] {
  display: block;
}
.list {
  margin-bottom: 15px;
}
.list[dir="ltr"] {
  text-align: left;
}
.list[dir="ltr"] .paragraph-block {
  text-align: justify;
}
.list[dir="ltr"] sub {
  vertical-align: sub;
  font-size: 12px;
}
.list[dir="ltr"] sub span {
  font-size: 12px;
}
.list li {
  text-align: justify;
}
.list li,
.ordered_list li {
  margin-bottom: 15px;
}
.ordered_list li p {
  margin-bottom: 0;
}
.ordered_list li .list li:before {
  color: #888;
}
.ordered_list li .ordered_list_number {
  display: inline-block;
  padding-left: 5px;
}
.ordered_list li .ordered_list_number + .paragraph-block,
.ordered_list li .ordered_list_number + p {
  display: inline;
}
.ordered_list[dir="ltr"] li .ordered_list_number {
  display: inline-block;
  padding-left: 0;
  padding-right: 5px;
}
.itemized_list_ar[dir="ltr"] li {
  padding-right: 0;
  padding-left: 15px;
}
.itemized_list_ar[dir="ltr"] li:before {
  content: "\f2f6";
  right: auto;
  left: 0;
  line-height: 1;
}
.itemized_list_ar li {
  display: block;
  position: relative;
  padding-right: 15px;
  line-height: 1.7;
}
.itemized_list_ar li:before {
  content: "\f2f4";
  font-family: Material-Design-Iconic-Font;
  color: #888;
  font-size: 24px !important;
  line-height: 1.3;
  position: absolute;
  right: 0;
  top: 0;
}
.itemized_list_ar li:last-child {
  margin-bottom: 0;
}
.itemized_list_ar li.section {
  margin-top: 30px;
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
  font-family: NotoKufiArabic, sans-serif;
  font-size: 17px !important;
}
.itemized_list_ar li.section:first-child {
  margin-top: 0;
}
.itemized_list_ar li.section:before,
.itemized_list_ar li.section a {
  color: #ff7a4f;
}
.itemized_list_ar li.sub-book {
  margin-top: 30px;
  margin-bottom: 10px;
  font-family: NotoKufiArabic, sans-serif;
  font-size: 20px !important;
  padding-right: 0;
}
.itemized_list_ar li.sub-book:first-child {
  margin-top: 0;
}
.itemized_list_ar li.sub-book:before {
  display: none;
}
.itemized_list_ar li.sub-book li {
  font-family: NotoNaskhArabic, sans-serif !important;
  font-size: 18px !important;
}
.itemized_list_ar li.sub-book li.section {
  margin-top: 30px;
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
  font-family: NotoKufiArabic, sans-serif;
  font-size: 17px !important;
}
.itemized_list_ar li.sub-book li.section:first-child {
  margin-top: 20px;
}
.itemized_list_ar li a {
  color: #ff7a4f;
  display: inline;
}
.itemized_list_ar li a:hover {
  text-decoration: underline;
}
.itemized_list_ar .paragraph-block:last-child {
  margin-bottom: 0;
}
ul.list li a {
  color: #ff7a4f;
}
.itemized_list_ar.itemized_list_bullet li,
.itemized_list_bullet li {
  margin-bottom: 5px;
}
.itemized_list_ar.itemized_list_bullet li:before,
.itemized_list_bullet li:before {
  content: "";
  width: 5px;
  height: 5px;
  background: #ccc;
  border-radius: 50%;
  margin-left: 10px;
  top: 11px;
}
.itemized_list_ar.itemized_list_bullet[dir="ltr"] li:before,
.itemized_list_bullet[dir="ltr"] li:before {
  margin-left: 0;
  margin-right: 10px;
}
.footnote_line {
  display: block;
  margin: 30px 0;
}
.footnote_line:before {
  content: "";
  display: block;
  width: 40%;
  height: 1px;
  background-color: #ccc;
}
.subtitle {
  text-align: center;
  margin-bottom: 30px;
  font-size: 22px;
}
.external-link {
  word-break: break-all;
}
.equation {
  display: block;
  text-align: center;
  margin: 20px 0;
  position: relative;
}
.equation .equation-number {
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -12px;
}
.paragraph-block span.align_left:only-child[dir="ltr"] {
  display: block;
}
.quran {
  display: inline;
  text-align: right;
  float: none;
  position: relative;
}
.quran:before {
  content: "﴿";
}
.quran:after,
.quran:before {
  font-family: Quran;
  display: inline;
}
.quran:after {
  content: "﴾";
}
.blockquote .blockquote,
.bridge_head_center {
  margin: 0;
}
.paragraph-block .question:first-child {
  margin-top: 10px;
}
.foreignphrase bdo {
  display: block;
}
.o_link_break {
  word-break: break-all;
}
html {
  height: calc(100% - 10px);
}
body {
  height: calc(100% - 40px);
  padding: 20px 15px;
}
.fp {
  min-height: 100%;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
}
.fp,
.fp .title {
  text-align: center;
}
.fp .author {
  font-size: 1.2em;
  margin: 2em auto;
  font-weight: 700;
}
.fp .subtitle {
  font-weight: 700;
  margin-bottom: 2em;
  text-align: center;
}
.fp p {
  line-height: 1.5em;
  margin-bottom: 3em;
}
.fp .logos {
  margin-top: auto;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -ms-flex-align: center;
  align-items: center;
}
.fp .hindawilogo {
  margin: 0 auto;
  height: 100px;
  background-image: url(../Images/hindawi_logo.svg);
  background-repeat: no-repeat;
  background-color: #fff;
  background-position: 50%;
  background-size: 70px;
  overflow: auto;
  width: 100%;
  -ms-flex: 1;
  flex: 1;
}
.fp .hindawilogo:not(:only-child) {
  background-position: 100%;
}
.fp .secondLogo {
  -ms-flex: 1;
  flex: 1;
  width: 100%;
  text-align: left;
  height: 100px;
  background-image: url(../Images/minbaralhurriyaLogo.svg);
  background-repeat: no-repeat;
  background-color: #fff;
  background-position: 0;
  background-size: 85px;
  overflow: auto;
}
.copyright .header {
  margin-bottom: 4em;
  float: left;
  width: 100%;
}
.copyright .header > div {
  width: 100%;
  float: right;
}
.copyright .header > div h2 {
  padding: 0.2em 0.5em;
  border-right: 5px solid #000;
  font-size: 24px;
  float: right;
  width: 43%;
  font-weight: 700;
  line-height: 1;
}
.copyright .header > div h2:nth-child(2) {
  float: left;
  border: 0;
  text-align: left;
  padding-left: 0;
}
.copyright .header > div h3 {
  font-weight: 400;
  width: 50%;
  float: right;
  margin: 0;
  font-size: 20px;
}
.copyright .header > div h3:nth-child(2) {
  float: left;
  text-align: left;
}
.copyright .copyright-content {
  border-right: 1px solid #000;
  margin: 0;
  padding: 1em 2em 0 0;
  font-size: 0.8em;
}
.copyright .copyright-content p {
  line-height: 1.4em;
}
.copyright .copyright-content p:first-of-type {
  margin-top: 0 !important;
}
.copyright .copyright-content .left {
  font-family: Constantia, Lucida Bright, DejaVu Serif, Georgia, serif;
  margin-bottom: 0;
}
.copyright [dir="ltr"] {
  font-family: inherit;
  font-size: inherit !important;
}
.copyright [dir="ltr"] sub {
  vertical-align: sub;
}
.copyright [dir="ltr"] sub,
.copyright [dir="ltr"] sub span {
  font-size: inherit !important;
}
.cf:after,
.cf:before {
  content: " ";
  display: table;
}
.cf:after {
  clear: both;
}
.m_b_12 {
  margin-bottom: 15px;
}
.dialogue b + b,
.dialogue b + span + b {
  margin-right: 0;
}
.shaker {
  font-family: NotoNaskhArabic-Bold;
}
.shaker2 {
  font-family: NotoKufiArabic-Bold;
}
']`;
