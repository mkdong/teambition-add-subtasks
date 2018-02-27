let pad2 = (n)=>("000"+n).slice(-2)

let formatDate = (d)=>(""+d.getFullYear()+pad2(d.getMonth()+1)+pad2(d.getDate()))

let nextDay = (d)=>(new Date(d.getTime()+1000*60*60*24))
let setY = (y)=>{
  $("body > div.modal.in > div.object-modal-view.modal-dialog.card.fixed > div > section > div.task-detail-infos-wrap > div > div.detail-infos-subtask-view > div.subtask-card.creating > div.subtask-creator > div > div.subtask-wrap.row-flex > section > div > div > div > textarea").val(y);
  $("body > div.modal.in > div.object-modal-view.modal-dialog.card.fixed > div > section > div.task-detail-infos-wrap > div > div.detail-infos-subtask-view > div.subtask-card.creating > div.subtask-creator > div > div.subtask-handler-set.clearfix.has-task-field-config > a.save-subtask-handler.btn.btn-primary").click();
}

let waitFinish = (cb, o, d, e) => {
  let val = $("body > div.modal.in > div.object-modal-view.modal-dialog.card.fixed > div > section > div.task-detail-infos-wrap > div > div.detail-infos-subtask-view > div.subtask-card.creating > div.subtask-creator > div > div.subtask-wrap.row-flex > section > div > div > div > textarea").val();
  if (!val)
    cb(o, d, e);
  else
    setTimeout(waitFinish, 200, cb, o, d, e);
};

let setYs = (o,d,e)=>{
  if(d<=e){
    o.html("Adding subtask " + formatDate(d) + " ...");
    setY(formatDate(d));
    waitFinish((o, d, e)=>{
      setYs(o, nextDay(d), e);
    }, o, d, e);
  } else {
    o.remove();
  }
};

let addSubtasks = (start, end) => {
  let overlay = $("<div>");
  overlay.addClass("large-overlay");
  $("body").append(overlay);

  setYs(overlay, start, end);
};

let doAdd = () => {
  let start = $("#subtask-sta").val();
  let end = $("#subtask-end").val();
  if (!start) {
    alert("请选择合法的开始日期");
    return false;
  }
  if (!end) {
    alert("请选择合法的结束日期");
    return false;
  }
  start = new Date(start);
  end = new Date(end);
  if (start > end) {
    alert("开始日期应不晚于结束日期");
    return false;
  }
  addSubtasks(start, end);
};


let addLayer = () => {
  let left= $("<span>");
  left.addClass('subtask-add-batch-left');

  let from = $("<label>");
  from.html("从");
  let to = $("<label>");
  to.html("到");

  let div = $("<div>");
  let date = $("<input>");
  date.attr('type', 'date');
  date.attr('id', 'subtask-sta');
  date.attr('required', true);
  left.append(from);
  left.append(date);

  date = $("<input>");
  date.attr('type', 'date');
  date.attr('id', 'subtask-end');
  date.attr('required', true);
  left.append(to);
  left.append(date);

  div.addClass('subtask-add-batch');

  btn = $("<a>");
  btn.html("批量添加");
  btn.addClass("btn");
  btn.addClass("btn-primary");
  btn.click(doAdd);

  div.append(left);
  div.append(btn);

  $(".subtask-creator").append(div);
};

let load = () => {
  const config = { subtree: false, attributes: false, childList: true };

  let callback = function(mutationsList) {
    for(let mutation of mutationsList) {
      if (mutation.addedNodes.length &&
          mutation.addedNodes[0].className === "modal in") {
        let wait = () => {
          if ($(".subtask-add-handler").length) {
            addLayer();
          } else {
            setTimeout(wait, 500);
          }
        };
        setTimeout(wait, 500);
      }
    }
  };
  let observer = new MutationObserver(callback);
  observer.observe(document.body, config);
};

document.addEventListener('DOMContentLoaded', load);
