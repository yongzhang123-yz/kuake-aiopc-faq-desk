'use strict';
const rawSample='问：制作一条短视频需要多少钱？\n答：根据时长、拍摄和后期要求报价，请先提供需求，确认清单后给出正式报价。\n\n问：通常多久交付？\n答：示例约定为资料齐备后7个自然日，实际以双方确认的项目安排为准。\n\n问：可以修改几次？\n答：示例方案包含2轮集中修改，新增拍摄或脚本重写另行确认。\n\n问：客户需要提供什么？\n答：请提供品牌资料、产品参数、参考视频，以及有权使用的图片或视频。';
let cards=[];
W.mount({...TOOL,demo:()=>{W.set('raw',rawSample);W.set('search','');W.set('tag','全部');}});
W.add(W.field('raw','已有客户问答','textarea','','每组：第一行问题，后续行答案；组间空一行。可用“问：/答：”前缀'),W.row(W.field('search','关键词检索','search','','搜索问题和答案'),W.field('tag','分类筛选','select','全部','',['全部','价格','交付','售后','产品与服务'])),W.field('language','AI辅助目标语言','select','中英双语','',['中英双语','中文','英语']));
function draw(){
 const q=W.value('search').toLowerCase(), tag=W.value('tag'), shown=cards.filter(c=>(tag==='全部'||c.tag===tag)&&(!q||(c.question+' '+c.answer).toLowerCase().includes(q))), out=W.h('article',{class:'document'});
 out.append(W.h('h2',{text:'客户问答 · '+shown.length+' 条'}));
 for(const c of shown)out.append(W.h('div',{class:'qa-card'},[W.h('span',{class:'tag',text:c.tag}),W.h('h3',{text:c.question}),W.h('p',{text:c.answer}),W.h('button',{class:'small',text:'复制这条回复',onclick:()=>W.copy(c.answer)})]));
 if(!shown.length)out.append(W.h('p',{text:'当前筛选没有匹配问答，请更换关键词或分类。'}));
 W.setResult('# 客户问答手册\n\n'+cards.map(c=>'## ['+c.tag+'] '+c.question+'\n'+c.answer).join('\n\n'),out);W.status('已整理'+cards.length+'条，当前展示'+shown.length+'条；导出包含全部问答');
}
W.onRun(()=>{cards=OPCLib.parseQA(W.value('raw'));if(!cards.length)throw Error('请先填写问答');draw();});
W.$('#f-search').addEventListener('input',()=>{if(cards.length)draw();});W.$('#f-tag').addEventListener('change',()=>{if(cards.length)draw();});
W.onAI(async()=>{if(!W.value('raw'))throw Error('请填写已有问答');W.setResult(await W.generate(W.aiPrompt('将原有问答整理为'+W.value('language')+'客服话术。保留原有价格和服务边界，不额外承诺。按问/答格式输出，最后列出待确认项。',W.data())));});
