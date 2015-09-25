;(function($){
	var Plugin = function(ele,opt){
		this.$element = ele;
		this.defaults = {
			url:"",
			columns:[{"text":"会员编号",sortable:true},{"text":"用户名",sortable:true},{"text":"姓名",sortable:true},{"text":"身份证编号",sortable:true},{"text":"注册时间"},{"text":"照片审核状态"},{"text":"账户"},{"text":""},{"text":""},{"text":""}],
			data:[],
			rowPerPage:20,
			rowCount:0,
			selectItems:[{text:"用户名",value:"0"},{text:"姓名",value:"1"},{text:"身份证编号",value:"2"}],
			filterItems:[{text:"所有",value:"0"},{text:"未上传",value:"1"},{text:"待审核",value:"2"},{text:"审核失败",value:"3"},{text:"审核通过",value:"4"}],
			initCurrentPage:1,
			initTotalPage:1,
			initTotalRecord:0,
			isRefresh:true,
			refreshPeriod:5000,
			sortColumnIndex:0,
			sortDerction:"desc",
			currentPage:0,
			totalPage:0,
			totalRecord:0,
			conditions:{
				page:1,
				sort:0,
				col:-1,
				dir:"desc",
				matches:0,
				matches_name:-1,
				matches_value:"",
				status:0
			},
			sort:function(){
				window.alert("排序");
				this.render();
			},
			download:function(){
				window.alert("下载");
				this.render();
			},
			prepage:function(){
				window.alert("上一页");
				this.render();
			},
			nextpage:function(){
				window.alert("下一页");
				this.render();
			},
			gotopage:function(){
				window.alert("跳转");
				this.render();
			},
			refresh:function(){
				window.alert("刷新");
				window.location.reload();
			},
			statuschange:function(value){
				window.alert("当前值:"+value);
				this.conditions.status = value;
				this.render();
			},
			search:function(name,value){
				window.alert("查找name="+name+",value="+value);
				this.conditions.matches_name = name;
				this.conditions.matches_value = value;
				this.render();
			}
		};
		this.options = $.extend({},this.defaults,opt);
	};
	
	Plugin.prototype = {
		init:function(){
			this.$element.html("");
			this.$element.append(this.createElementHtml());
			this.initTable();
			//this.initPage();
			this.render();
			this.initControls();
		},
		createElementHtml:function(){
			var context,tabove,table,thead,tbody,tfoot,tbelow;
			context = $("<div id='jTable-context'></div>");
			tabove = $("<div id='jTable-above'></div>");
			tmiddle = $("<div id='jTable-middle'></div>");
			table = $("<table id='jTable-table'></table>");
			thead = $("<thead id='jTable-thead'></thead>");
			tbody = $("<tbody id='jTable-tbody'></tbody>");
			tfoot = $("<tfoot id='jTable-tfoot'></tfoot>");
			tbelow = $("<div id= 'jTable-below'></div>");
			template = $("<div id='jTable-template'></div>");
			
			var theadtr = $("<tr></tr>");
			for(var e in this.options.columns){
				var c = this.options.columns[e].sortable? "sortable-col":"nosortable-col";
				var col = "<th class='"+c+"'>"+this.options.columns[e].text+"</th>";
				theadtr.append(col);
			}
			thead.append(theadtr);
			
			table.append(thead);
			table.append(tbody);
			table.append(tfoot);
			tmiddle.append(table);
			
			//清除浮动
			var $div_clear = $("<div style='clear:both;'></div>");
			tmiddle.append($div_clear);
			
			context.append(tabove);
			context.append("<div class='split'></div>");
			context.append(tmiddle);
			context.append("<div class='split'></div>");
			context.append(tbelow);
			context.append(template);
			return context;
		},
		initTemplate:function(){
			var $templateContainer = $("#jTable-template");
			//修改密码的模板
			var tmpl_reset_password_context = $("<div id='resetPasswordTmpl' class='template'></div>").append("<div class='template-background'></div>");
			var main = $("<div class='template-main'></div>");
			var modal = $("<div class='modal'></div>");
			var modal_header = $("<div class='modal-header'></div>");
			modal_header.append("<button class='cloes-btn'>×</button>");
			modal_header.append("<h3><span> 修改用户密码 </span></h3>");
			var modal_body = $("<div class='modal-body'></div>");
			var t1 = $("<label> 用户名：</label> <span id='loginName'>AAA3</span>");
			var t2 = $("<label> 客户姓名：</label> <span id='clientName'>11</span><br/>");
			var t3 = $("<label> 密码：</label><input name='password' type='password' maxlength='20' id='password' value='' alt='^[0-9A-Za-z]{6,20}$' onblur='checkAlterPassword(\"password\");'><i id='password@i' class=''></i><span>6-20位的数字或者字母.</span><br/>");
			var t4 = $("<label> 确定密码：</label><input name='passwordConfirm' type='password' maxlength='20' id='passwordConfirm' value='' onblur=\"checkConfirmPassword(this,'password');\"><i id='passwordConfirm@i' class=''></i><span id='passwordConfirm@span'>6-20位的数字或者字母.</span><br/>");
			modal_body.append(t1);
			modal_body.append(t2);
			modal_body.append(t3);
			modal_body.append(t4);
			var modal_foot = $("<div class='modal-footer'>").append("<button onclick=\"postUdtRgtPwdWin('#changePassword')\" type='button' showloading='true' disablesiblings='true' btn-info='' class='btn btn-info standardButtonWidth'>确定</button>").append("<button onclick=\"closeUdtRgtPwdWin('#changePassword')\" type='button' btn-info='' class='btn standardButtonWidth'>取消</button>");
			main.append(modal_header);
			main.append(modal_body);
			main.append(modal_foot);
			tmpl_reset_password_context.append(main);
			//照片审核的模板
			var tmpl_id_audit_context = $("<div id='idAuditTmpl' class='template'></div>").append("<div class='template-backgournd'></div>");
			
			//用户信息的模板
			var tmpl_user_info_context = $("<div id='userInfoTmpl' class='template'></div>").append("<div class='template-backgournd'></div>");
			
			$templateContainer.append(tmpl_reset_password_context);
			$templateContainer.append(tmpl_id_audit_context);
			$templateContainer.append(tmpl_user_info_context);
		},
		initControls:function(){
			this.initAboveControls();
			this.initBelowControls();
			//this.initTemplate();
		},
		initAboveControls:function(){
			var that = this;
			
			$above = $("#jTable-above");
			//刷新按钮控件
			var $control_refresh = $("<div class='control control_refresh'></div>");
			var $a_refresh = $("<span class='btn'></span>").on("click",this.options.refresh);
			$control_refresh.append($a_refresh);
			//照片审核控件
			var $control_filter = $("<div class='control control_filter'></div>");
			var $span_filter = $("<span class='label'>照片审核状态</span>");
			var $select_filter = $("<select class='select'></select>").on("change",function(){
				var value = $(this).val();
				that.options.statuschange(value);
			});
			for(var e in this.options.filterItems){
				$select_filter.append("<option value='"+this.options.filterItems[e].value+"'>"+this.options.filterItems[e].text+"</option>");
			}
			$control_filter.append($span_filter);
			$control_filter.append($select_filter);
			//搜索控件
			var $control_search = $("<div class='control control_search'></div>");
			var $select_search = $("<select id='searchname' class='select'></select>").on("click",function(){
				that.options.conditions.matches=0;
				$("#searchvalue").val("");
			});
			for(var e in this.options.selectItems){
				$select_search.append("<option value='"+this.options.selectItems[e].value+"'>"+this.options.selectItems[e].text+"</option>");
			}
			var $input_search = $("<input id='searchvalue' type='text' class='txt' />");
			var $button_search = $("<input type='button' class='btn'/>").on("click",function(){
				that.options.conditions.matches=1;
				var name = $("#searchname").val();
				var value = $("#searchvalue").val();
				that.options.search(name,value);
			});
			$control_search.append($select_search);
			$control_search.append($input_search);
			$control_search.append($button_search);
			//清除浮动
			var $div_clear = $("<div style='clear:both;'></div>");
			
			$above.append($control_refresh);
			$above.append($control_search);
			$above.append($control_filter);
			$above.append($div_clear);
		},
		initBelowControls:function(){
			var that=this,$below, $ul, $li;
			$below = $("#jTable-below");
			$ul = $("<ul></ul>");
			
			//下载控件
			var $li_download = $("<li></li>");
			var $control_download = $("<div class='control'></div>");
			var $control_download_part1 = $("<span class='icon download' title='下载excel文件'></span>").on("click",function(){
				that.options.download();
			});
			$control_download.append($control_download_part1);
			$li_download.append($control_download);
			//上一页控件
			var $li_prepage = $("<li></li>");
			var $control_prepage = $("<div class='control'></div>");
			var $control_prepage_part1 = $("<span class='icon prepage' title='上一页'></span>").on("click",function(){
				that.options.conditions.page-=1;
				that.options.prepage();
			});
			$control_prepage.append($control_prepage_part1);
			$li_prepage.append($control_prepage);
			//下一页
			var $li_nextpage = $("<li></li>");
			var $control_nextpage = $("<div class='control'></div>");
			var $control_nextpage_part1 = $("<span class='icon nextpage' title='下一页'></span>").on("click",function(){
				that.options.conditions.page+=1;
				that.options.nextpage();
			});
			$control_nextpage.append($control_nextpage_part1);
			$li_nextpage.append($control_nextpage);
			//转到目标页
			var $li_gotopage = $("<li></li>");
			var $control_gotopage = $("<div class='control'></div>");
			var $control_gotopage_pageno = $("<input type='text' id='jTable-PageNo' value='"+this.options.initCurrentPage+"'/>");
			var $control_gotopage_fire = $("<span class='icon goto' title='跳转'></span>").on("click",function(){
				that.options.conditions.page=parseInt($control_gotopage_pageno.val());
				that.options.gotopage();
			});
			$control_gotopage.append($control_gotopage_pageno);
			$control_gotopage.append($control_gotopage_fire);
			$li_gotopage.append($control_gotopage);
			//当前页数显示
			var $li_index = $("<li></li>");
			var $control_index = $("<div class='control'></div>")
			var $control_index_currentpage = $("<span id='currentPage'>"+this.options.initCurrentPage+"</span>");
			var $control_index_split = $("<label>/</label>");
			var $control_index_totalpage = $("<span id='totalPage'>"+this.options.initTotalPage+"</span>");
			$control_index.append($control_index_currentpage);
			$control_index.append($control_index_split);
			$control_index.append($control_index_totalpage);
			$li_index.append($control_index);
			//总条数显示
			var $li_totalrecord = $("<li></li>");
			var $control_totalrecord = $("<div class='control'></div>");
			var $icon_totalrecord = $("<span class='icon record'></span>");
			var $value_totalrecord = $("<span id='totalRecord'>"+this.options.initTotalRecord+"</span>");
			$control_totalrecord.append($icon_totalrecord);
			$control_totalrecord.append($value_totalrecord);
			$li_totalrecord.append($control_totalrecord);
			//清除浮动
			var $div_clear = $("<div style='clear:both;'></div>");
			
			$ul.append($li_download);
			$ul.append($li_prepage);
			$ul.append($li_nextpage);
			$ul.append($li_gotopage);
			$ul.append($li_index);
			$ul.append($li_totalrecord);
			$below.append($ul);
			$below.append($div_clear);
		},
		initTable:function(){
			var that = this;
			$("#jTable-thead tr").find("th").each(function(index,e){
				if(that.options.columns[index].sortable){
					$(e).on("click",function(){
						that.options.conditions.sort=1;
						that.options.conditions.col=index;
						if($(this).attr("class")=="sortable-col"){
							$(this).parent().find("th[class^='table-col']").attr("class","sortable-col");
							$(this).attr("class","table-col-desc");
							that.options.conditions.dir="desc";
						}else if($(this).attr("class")=="table-col-desc"){
							$(this).parent().find("th[class^='table-col']").attr("class","sortable-col");
							$(this).attr("class","table-col-asc");
							that.options.conditions.dir="asc";
						}else if($(this).attr("class")=="table-col-asc"){
							$(this).parent().find("th[class^='table-col']").attr("class","sortable-col");
							$(this).attr("class","table-col-desc");
							that.options.conditions.dir="desc";
						}else{
							$(this).parent().find("th[class^='table-col']").attr("class","sortable-col");
							$(this).attr("class","sortable-col");
							that.options.conditions.sort=0;
						}
						that.options.sort();
					});
				}
			});
		},
		//@Deperecate
		initPage:function(){
			$.getJSON(this.options.url,this.options.conditions).done(function(dt){
				var tbody = $("#jTable-tbody").html("");
				var rows = dt.data;
				for(var i in rows){
					var c = i%2==0? "even-row":"odd-row";
					var tr = $("<tr class='"+c+"'></tr>");
					var row = rows[i];
					for(var j in row){
						var td = $("<td>"+row[j].text+"</td>");
						
						//add event handler
						for(var e in row[j].events){
							//!!!! use closure(return function) to save variable ev at this time for-loop.
							var ev = row[j].events[e];
							(function(td,ev){
								td.on(ev.on, function(){
									window[ev.handler].apply(window,ev.args);
								});
								if(ev.on=='click'){
									td.css("cursor","pointer");
									td.css("font-weight","bold");
								}
							})(td,ev);
						}
						tr.append(td);
					}
					tbody.append(tr);
				}
			});
		},
		getpage:function(){
			$.getJSON(this.options.url,this.options.conditions).done(function(dt){
				var tbody = $("#jTable-tbody").html("");
				var rows = dt.data;
				for(var e in rows){
					var c = e%2==0? "even-row":"odd-row";
					var tr = $("<tr class='"+c+"'></tr>");
					var row = rows[e];
					for(var i in row){
						var td = $("<td>"+row[i].text+"</td>");
						for(var j in row[i].events){
							var ev = row[i].events[j];
							(function(td,ev){
								td.on(ev.on, function(){
									window[ev.handler].apply(window,ev.args);
								});
								if(ev.on=='click'){
									td.addClass("active");
								}
							})(td,ev);
						}
						tr.append(td);
					}
					tbody.append(tr);
				}
			});
			$("#totalRecord").html();
			$("#totalPage").html();
			$("#currentPage").html();
		},
		render:function(){
			this.getpage();
		}
	};
	
	$.extend($.fn,{
		jTable:function(options){
			var plugin = new Plugin(this,options);
			plugin.init();
			plugin.g
		}
	});
})(jQuery);