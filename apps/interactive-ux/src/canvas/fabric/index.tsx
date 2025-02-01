import { Suspense, useEffect, useRef, useState } from "react";
import Lottie from "./fabric";
import lottie from "lottie-web";
import { fabric } from "fabric";

export default function LottieGround({}) {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>();
  const initCanvas = async () => {
    let w = 1262;
    let h = 454;
    const newCanvas = await new fabric.Canvas("canvas");
    let maxScale = 1.5;
    let minScale = 0.5;
    newCanvas.on("object:moving", (e) => {
      maxScale = 1.5;
      let obj = e.target;
      if (!obj) return;
      if (!obj.width) return;
      if (!obj.scaleX) return;
      if (!obj.height) return;
      if (!obj.canvas) return;
      if (!obj.canvas.width) return;
      if (!obj.canvas.height) return;

      let halfw = (obj.width * obj.scaleX) / 2;
      let halfh = (obj.height * obj.scaleX) / 2;
      let limit_l = obj.canvas.width - obj.width * obj.scaleX;
      let limit_b = obj.canvas.height - obj.height * obj.scaleX;
      let bounds = {
        tl: { x: halfw, y: halfh },
        br: { x: obj.canvas.width, y: obj.canvas.height },
      };

      if (!obj.top) return;
      if (!obj.left) return;
      if (!obj.height) return;
      if (!obj.canvas) return;

      if (obj.top < bounds.tl.y || obj.left < bounds.tl.x) {
        obj.top = Math.max(obj.top, 0);
        obj.left = Math.max(obj.left, 0);
      }
      if (
        obj.top + obj.height * obj.scaleX > bounds.br.y ||
        obj.left + obj.width * obj.scaleX > bounds.br.x
      ) {
        obj.top = Math.min(obj.top, limit_b);
        obj.left = Math.min(obj.left, limit_l);
      }
    });
    // // newCanvas.on("object:scaling", (e) => {
    // //   let obj = e.target;
    // //   obj.catgryId == "JC-23012602050000000"
    // //     ? (maxScale = 2)
    // //     : (maxScale = 1.5);
    // //   if (obj.scaleX > maxScale) {
    // //     obj.scaleX = maxScale;
    // //     obj.left = obj.lastGoodLeft;
    // //     obj.top = obj.lastGoodTop;
    // //   }
    // //   if (obj.scaleY > maxScale) {
    // //     obj.scaleY = maxScale;
    // //     obj.left = obj.lastGoodLeft;
    // //     obj.top = obj.lastGoodTop;
    // //   }
    // //   if (obj.scaleX < minScale) {
    // //     obj.scaleX = minScale;
    // //     obj.left = obj.lastGoodLeft;
    // //     obj.top = obj.lastGoodTop;
    // //   }
    // //   if (obj.scaleY < minScale) {
    // //     obj.scaleY = minScale;
    // //     obj.left = obj.lastGoodLeft;
    // //     obj.top = obj.lastGoodTop;
    // //   }
    // //   let halfw = (obj.width * obj.scaleX) / 2;
    // //   let halfh = (obj.height * obj.scaleX) / 2;
    // //   let bounds = {
    // //     tl: { x: halfw, y: halfh },
    // //     br: { x: obj.canvas.width, y: obj.canvas.height },
    // //   };

    // //   if (
    // //     obj.top + obj.height * obj.scaleX > bounds.br.y ||
    // //     obj.left + obj.width * obj.scaleX > bounds.br.x
    // //   ) {
    // //     e.target.scaleX = e.transform.scaleX;
    // //     e.target.scaleY = e.transform.scaleY;
    // //   }
    // //   e.target.lastGoodTop = e.target.top;
    // //   e.target.lastGoodLeft = e.target.left;
    // // });
    // // canvas 선택 block
    // newCanvas.uniformScaling = true;
    // newCanvas.selection = false;
    newCanvas.setHeight(h);
    newCanvas.setWidth(w);
    setCanvas(newCanvas);
    return () => {
      newCanvas.dispose();
    };
  };
  const countOverlapObj = (id: string) => {
    let x = 1;
    canvas?.getObjects().forEach((e: any) => {
      if (e.jitemId === id) {
        x = e.o_idx + 1;
      }
    });
    return x;
  };
  const activeItemblock = (e: { target: any }) => {
    if (!e.target) return;
    // reward.isActive &&
    canvas?.setActiveObject(e.target);
  };
  const returnCnt = (id: string, catgryId: string) => {
    const categoryList = jlandCate.findIndex((e) => e.catgryId === catgryId);
    const item = jlandCate[categoryList].jlandItem.findIndex(
      (e) => e.jitemId === id
    );
    return jlandCate[categoryList].jlandItem[item].jitemCnt;
  };
  const selectObj = (
    id: string,
    o_idx: any,
    catgryId: string,
    type: string
  ) => {
    const target = canvas?.getActiveObject();
    if (target) return;
    if (!canvas) return;
    canvas.getObjects().forEach(function (e) {
      if (e.jitemId === id && e.o_idx === o_idx) {
        // ispop.value.top = null;
        // ispop.value.left = null;
        // reward.isActive = true;
        // putItem.value = true;
        // crntSelection.value = { id, o_idx, catgryId };
        canvas.setActiveObject(e);
        const count = returnCnt(id, catgryId);
        e.bringToFront();
        // if (type == "select") {
        //   isSelection.value = true;
        //   isPurchase.value = 0;
        // } else if (count > 0) {
        //   updateCnt(id, catgryId, "minus");
        //   reset.value = { jitemId: id, catgry: catgryId, tp: "minus" };
        //   isSelection.value = true;
        //   isPurchase.value = 0;
        // } else {
        //   isPurchase.value = reward.returnItem(catgryId, id).price;
        //   isSelection.value = false;
        // }
        // canvas!.getActiveObject()!.borderRadius = "50px";
      }
    });
  };
  const useEvtObj = (obj: {
    target: { catgryId?: any; jitemId?: any; o_idx?: any };
  }) => {
    const target = canvas?.getActiveObject();
    // 액티브 상태일 때 막기
    if (target) return;
    // if (isSelection.value) return;
    // if (reward.isActive) return;
    // if (isPurchase.value > 0) return;
    const { jitemId, o_idx } = obj.target;
    // delay.value = setTimeout(() => {
    //   selectObj(jitemId, o_idx, obj.target.catgryId, "select");
    //   delay.value = null;
    // }, 1000);
  };
  const mouseUpLottie = (obj: { target: any }) => {
    // clearTimeout(delay.value);
    const targets = canvas?.getActiveObject();
    if (targets) return;
    if (obj.target.jitemTp == "T") return;
    // if (!isSelection.value || isPurchase.value > 0) {
    const { target } = obj;
    // const item = jlandCate
    //   .find((e) => e.catgryId === (target.catgryId as String))
    //   .jlandItem.find((e) => e.jitemId == target.jitemId);
    // const jitemFilePath = item.jitemFilePath;
    // if (jitemFilePath.indexOf("json") > 0)
    target.play();

    // }
  };
  const settingObj = (
    obj: { jitemId: string; x: any; y: undefined; scale: any; jitemTp: string },
    target: fabric.Image,
    catgryId: any
  ) => {
    if (!target || !obj) return;
    let o_idx = countOverlapObj(obj.jitemId);
    target.set("left", obj.x || 0);
    target.set(
      "top",
      obj.y == undefined ? 454 / 2 - target.height! / 2 : obj.y
    );
    target.set("scaleX", obj.scale || 1);
    target.set("scaleY", obj.scale || 1);
    // target.set("jitemId", obj.jitemId);
    // target.set("o_idx", o_idx);
    // target.set("jitemTp", obj.jitemTp);
    // target.set("catgryId", catgryId);
    // target.set("catgryId", catgryId);
    target.set("selectable", false);
    target.set("lockScalingFlip", true);
    target.setControlVisible("tl", false);
    target.setControlVisible("tr", false);
    target.setControlVisible("bl", false);
    target.setControlVisible("br", true);
    target.setControlVisible("mtr", false);
    if (obj.jitemTp == "T") {
      target.set("lockMovementX", true);
      target.set("lockMovementY", true);
      target.set("left", 1262 / 2 - target.width! / 2);
      target.setControlVisible("mr", false);
      target.setControlVisible("mt", false);
      target.setControlVisible("ml", false);
      target.setControlVisible("mb", false);
      target.setControlVisible("br", false);
    }
    // target.on("deselected", activeItemblock);
    // target.on("mousedown", useEvtObj);
    // target.on("mouseup", mouseUpLottie);
    // target.on("mouseout", () => {
    //   clearTimeout(delay.value);
    // });

    return target;
  };
  const returnItem = (catgryId: string, itemId: string) => {
    console.log(catgryId, itemId);

    const itemInfo = {
      jitemNm: jlandCate
        .find((e) => e.catgryId == catgryId)
        ?.jlandItem.find((i) => i.jitemId === itemId)?.jitemNm,
      jitemThumbPath: jlandCate
        .find((e) => e.catgryId == catgryId)
        ?.jlandItem.find((i) => i.jitemId === itemId)?.jitemThumbPath,
      price: jlandCate
        .find((e) => e.catgryId == catgryId)
        ?.jlandItem.find((i) => i.jitemId === itemId)?.price,
      jitemFilePath: jlandCate
        .find((e) => e.catgryId == catgryId)
        ?.jlandItem.find((i) => i.jitemId === itemId)?.jitemFilePath,
      jitemTp: jlandCate
        .find((e) => e.catgryId == catgryId)
        ?.jlandItem.find((i) => i.jitemId === itemId)?.jitemTp,
    };
    return itemInfo;
  };
  const addCanvasObj = async (obj: any, catgryId: any) => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) return;

    // putItem.value = true;
    const { x, y } = obj;
    const jitemFilePath = returnItem(catgryId, obj.jitemId).jitemFilePath;
    if (!jitemFilePath) return;

    if (jitemFilePath?.indexOf("json")) {
      // const canvas = canvas as fabric.Canvas;
      // const data:{w:number,h:number,nm:string,ddd:number,assets:string} = await fetch(jitemFilePath);
      // const data: Response<T> = await fetch();
      // console.log(data);
      const canvasEl = document.getElementById("canvas");
      fetch(jitemFilePath)
        .then((res) => res.json())
        .then((res: { w: number; h: number }) => {
          console.log(res);
          canvas.width = res.w;
          canvas.height = res.h;
          const animItem = lottie.loadAnimation({
            container: canvasEl!,
            renderer: "canvas",
            autoplay: false,
            animationData: res,
            rendererSettings: {
              context: canvas.getContext("2d"),
              preserveAspectRatio: "xMidYMid meet",
            },
          });
          animItem.addEventListener("enterFrame", () => {
            canvas?.requestRenderAll();
          });
          animItem.addEventListener("complete", () => {
            console.log("complete");

            // lottieComplete(animItem);
          });
          console.log(animItem);

          animItem.goToAndStop(0, true);
          animItem.addEventListener("DOMLoaded", () => {
            const ane = new Lottie(
              canvas,
              {
                objectCaching: true,
              },
              animItem
            );
            const target = settingObj(obj, ane, catgryId);

            canvas?.add(target!);
            canvas?.renderAll();
            x == undefined &&
              selectObj(obj.jitemId, target!.o_idx!, target!.catgryId!, "add");
          });
        });
    }
  };
  const jlandCate = [
    {
      catgryId: "JC-23012602020000000",
      catgryOrds: 1,
      catgryNm: "놀이 기구",
      catgryThumbPath:
        "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/category/tab_play.png",
      jlandItem: [
        {
          jitemId: "JI-231207P5468036686",
          catgryId: "JC-23012602020000000",
          jitemOrds: 1,
          jitemTp: "G",
          jitemNm: "대관람차 3",
          jitemCnt: 0,
          price: 20,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-231207P5468036686/2023/12/07/rev1/20231207085413-66b747fa757f420e801fdf8e2fa6deca.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-231207P5468036686/2023/12/07/rev1/20231207085413-2b93534f0b65492ebe2beec3d39bb533.json",
          jitemAnimalPath: null,
          jitemAnimalAudioPath: null,
          animalInfo: null,
        },
        {
          jitemId: "JI-231207P6160037445",
          catgryId: "JC-23012602020000000",
          jitemOrds: 2,
          jitemTp: "G",
          jitemNm: "롤러코스터 3",
          jitemCnt: 0,
          price: 20,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-231207P6160037445/2023/12/07/rev1/20231207084902-7a3e532a354e499185d5e85eb64538b3.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-231207P6160037445/2023/12/07/rev1/20231207084902-802fcbff2a3148adbf99165402f284e9.json",
          jitemAnimalPath: null,
          jitemAnimalAudioPath: null,
          animalInfo: null,
        },
        {
          jitemId: "JI-231207P2919111782",
          catgryId: "JC-23012602020000000",
          jitemOrds: 3,
          jitemTp: "G",
          jitemNm: "승용기구-호랑이 3",
          jitemCnt: 0,
          price: 7,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-231207P2919111782/2023/12/07/rev1/20231207084818-da2f6cf4a71e4c11ac69ce3216e7d201.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-231207P2919111782/2023/12/07/rev1/20231207084818-1fc7375a9e08483b9f44160c81b9993f.json",
          jitemAnimalPath: null,
          jitemAnimalAudioPath: null,
          animalInfo: null,
        },
        {
          jitemId: "JI-230907P8615991257",
          catgryId: "JC-23012602020000000",
          jitemOrds: 4,
          jitemTp: "G",
          jitemNm: "회전그네 3",
          jitemCnt: 1,
          price: 10,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-230907P8615991257/2023/09/07/rev1/20230907092231-3197713da7114ff38c414a839c985600.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-230907P8615991257/2023/09/07/rev1/20230907092231-cf8a2f50ae3845aea2d16a54e24c3261.json",
          jitemAnimalPath: null,
          jitemAnimalAudioPath: null,
          animalInfo: null,
        },
        {
          jitemId: "JI-230803P4251070924",
          catgryId: "JC-23012602020000000",
          jitemOrds: 7,
          jitemTp: "G",
          jitemNm: "대관람차",
          jitemCnt: 0,
          price: 20,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-230803P4251070924/2023/08/03/rev1/20230803093223-9decb82e1883414b879d73134b45e3d1.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-230803P4251070924/2023/08/03/rev1/20230803093223-bcbd6d96de914d4c95e2f7181b0e591c.json",
          jitemAnimalPath: null,
          jitemAnimalAudioPath: null,
          animalInfo: null,
        },
      ],
    },
    {
      catgryId: "JC-23012602050000000",
      catgryOrds: 2,
      catgryNm: "동물",
      catgryThumbPath:
        "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/category/tab_zoo.png",
      jlandItem: [
        {
          jitemId: "JI-231207P9669855619",
          catgryId: "JC-23012602050000000",
          jitemOrds: 1,
          jitemTp: "G",
          jitemNm: "인도공작(흰색)",
          jitemCnt: 0,
          price: 20,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-231207P9669855619/2023/12/07/rev1/20231207090320-9a7ab36a8d9e481eba2109c7c678ee5a.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-231207P9669855619/2023/12/07/rev1/20231207090321-6c1994111559408694014ff6817f9bae.json",
          jitemAnimalPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/JI-231207P9669855619/2023/12/07/rev1/20231207090321-b33fc8a94259436bb60a3b821df0531d.png",
          jitemAnimalAudioPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/audio/JI-231207P9669855619/2023/12/07/rev1/20231207090321-6752c39cabc54481895c7edb565b500c.mp3",
          animalInfo: {
            habitat: "인도, 동남아시아, 말레이시아 등",
            eating: "잡식성 (곡류, 과일, 지네, 곤충 등)",
            feature:
              '<div class="ewa-rteLine" 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"="">⦁&nbsp;머리 위에 부채모양의 장식 깃이 있음</div><div class="ewa-rteLine" 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"="">⦁&nbsp;사람들이 인위적으로 만들어낸 종임&nbsp;</div><div class="ewa-rteLine" 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"="">⦁&nbsp;수컷은 화려한 위꼬리덮깃을 부채모양으로 펼쳐 자신을 과시함</div>',
          },
        },
        {
          jitemId: "JI-231207P8068735902",
          catgryId: "JC-23012602050000000",
          jitemOrds: 2,
          jitemTp: "G",
          jitemNm: "타조",
          jitemCnt: 0,
          price: 20,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-231207P8068735902/2023/12/07/rev1/20231207090128-d2a9f8cf0e79432081079c8da5d4bbe9.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-231207P8068735902/2023/12/07/rev1/20231207090128-6cf7b3fab82743d181db1d9804e91aa3.png",
          jitemAnimalPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/JI-231207P8068735902/2023/12/07/rev1/20231207090128-4e8ff6da33044208bb48d7a1028a49a4.png",
          jitemAnimalAudioPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/audio/JI-231207P8068735902/2023/12/07/rev1/20231207090128-a808b297afca48b8a0dfb30c462a75bb.mp3",
          animalInfo: {
            habitat: "아프리카 초원 지대",
            eating: "잡식성 (녹색 풀, 씨앗, 도마뱀, 작은 곤충 등)",
            feature:
              '<div class="ewa-rteLine" 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"="">⦁&nbsp;이 세상에서 제일 큰 새. 날개가 작아서 날지 못함</div><div class="ewa-rteLine" 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"="">⦁&nbsp;발가락이 두 개이며, 다리가 튼튼해서 새들 중에는 땅에서 가장 빠르게 달릴 수 있음</div><div class="ewa-rteLine" 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"="">⦁&nbsp;여러 마리가 무리를 지어서 생활함</div>',
          },
        },
        {
          jitemId: "JI-231207P1002332083",
          catgryId: "JC-23012602050000000",
          jitemOrds: 3,
          jitemTp: "G",
          jitemNm: "판다",
          jitemCnt: 0,
          price: 20,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-231207P1002332083/2023/12/07/rev1/20231207090005-892533337dd949fe8587bbd18c65380b.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-231207P1002332083/2023/12/07/rev1/20231207090005-9fd2f174b0b64dda9f4ace3d045cdaa5.png",
          jitemAnimalPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/JI-231207P1002332083/2023/12/07/rev1/20231207090005-4776ad0cab68411cb050ba64ab023951.png",
          jitemAnimalAudioPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/audio/JI-231207P1002332083/2023/12/07/rev1/20231207090005-bd42c2abe25c4f30930dbdc0f93402a2.mp3",
          animalInfo: {
            habitat: "중국 쓰촨성 일대",
            eating: "초식성 (대나무, 죽순, 과일, 아채 등)",
            feature:
              '<div class="ewa-rteLine" 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"="">⦁&nbsp;눈 주위, 귀, 네 다리 털은 검은색, 나머지는 흰색털로 덮여있음</div><div class="ewa-rteLine" 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"="">⦁&nbsp;하루에 10시간 이상 먹이를 먹음</div><div class="ewa-rteLine" 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"="">⦁&nbsp;무리를 짓지 않고 혼자 생활함</div>',
          },
        },
        {
          jitemId: "JI-231207P7445960572",
          catgryId: "JC-23012602050000000",
          jitemOrds: 4,
          jitemTp: "G",
          jitemNm: "반달가슴곰",
          jitemCnt: 0,
          price: 20,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-231207P7445960572/2023/12/07/rev1/20231207085852-8dd07ab5ffc34d4a8bfdeaa08652026f.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-231207P7445960572/2023/12/07/rev1/20231207085852-e8153a96026b4727afbf3badad8dfb66.png",
          jitemAnimalPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/JI-231207P7445960572/2023/12/07/rev1/20231207085852-ec11356dbe664b86b6bb22c6644a4d10.png",
          jitemAnimalAudioPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/audio/JI-231207P7445960572/2023/12/07/rev1/20231207085852-e36b6c00df484d8abd6a55358d4e5739.mp3",
          animalInfo: {
            habitat: "한국, 중국, 연해주 등의 산 속",
            eating: "잡식성 (식물의 뿌리, 과일, 곤충, 작은 동물 등)",
            feature:
              '<div class="ewa-rteLine" 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"="">⦁&nbsp;앞 가슴에 반달 모양의 하얀 무늬가 있음</div><div class="ewa-rteLine" 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"="">⦁&nbsp;낮에는 굴 속에서 쉬고 밤에 활동함</div><div class="ewa-rteLine" 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"="">⦁ 나무를 잘 타고 수영도 잘함</div><div>⦁&nbsp;멸종위기에 처해 있어서, 천연기념물로 등록되어 있음<br></div>',
          },
        },
        {
          jitemId: "JI-231207P7175275251",
          catgryId: "JC-23012602050000000",
          jitemOrds: 5,
          jitemTp: "G",
          jitemNm: "사자",
          jitemCnt: 0,
          price: 20,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-231207P7175275251/2023/12/07/rev1/20231207085647-17f50391406d4b50a0135a2da0f0ca4e.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-231207P7175275251/2023/12/07/rev1/20231207085647-a1c824323ebb491c951e918476b1d8f6.json",
          jitemAnimalPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/JI-231207P7175275251/2023/12/07/rev1/20231207085647-6c54882c7faa45fe9ebc01c7f512c8ae.png",
          jitemAnimalAudioPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/audio/JI-231207P7175275251/2023/12/07/rev1/20231207085647-fe2510c2e8124e559e6a39b679816d26.mp3",
          animalInfo: {
            habitat: "아프리카, 인도",
            eating: "육식성 (영양, 얼룩말, 작은 동물 등)",
            feature:
              '<div class="ewa-rteLine" 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"="">⦁&nbsp;암컷, 수컷 모두 꼬리 끝에 술 모양의 갈색 털이 있음</div><div class="ewa-rteLine" 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"="">⦁&nbsp;수사자는 목둘레에 갈기털이 있음</div><div class="ewa-rteLine" 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"="">⦁&nbsp;여러 마리가 무리를 지어서 생활하며, 주로 암사자가 사냥을 함</div>',
          },
        },
        {
          jitemId: "JI-230907P1692713873",
          catgryId: "JC-23012602050000000",
          jitemOrds: 6,
          jitemTp: "G",
          jitemNm: "침팬지",
          jitemCnt: 0,
          price: 20,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-230907P1692713873/2023/09/07/rev1/20230907095658-fc377037bbdc4d28b1ec4054c71b86cc.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-230907P1692713873/2023/09/07/rev1/20230907095658-e67bf733b4fc4c10b2c635ffe91b4916.png",
          jitemAnimalPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/JI-230907P1692713873/2023/09/07/rev1/20230907095658-acc1958a61b445318748151c02ff92d6.png",
          jitemAnimalAudioPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/audio/JI-230907P1692713873/2023/09/07/rev1/20230907095658-dc55d28beb2945078758e878986b8031.mp3",
          animalInfo: {
            habitat: "아메리카의 초원, 사막 등",
            eating: "잡식성 (곤충, 작은 포유류, 과일, 곡식, 새, 새알 등)",
            feature:
              "<p>⦁ 청각과 시각이 발달해 색깔을 구별할 수 있음</p><p>⦁ 유인원 중 가장 동작이 민첩하고 활발함</p><p>⦁ 지능이 발달돼 있어서 간단한 도구를 만들어 쓸 수 있음</p><p>⦁ 20마리 정도가 무리 지어 생활</p>",
          },
        },
        {
          jitemId: "JI-230907P1161663608",
          catgryId: "JC-23012602050000000",
          jitemOrds: 7,
          jitemTp: "G",
          jitemNm: "코알라",
          jitemCnt: 0,
          price: 10,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-230907P1161663608/2023/09/07/rev1/20230907084352-a255b97e866f42cc97047b3a92b22cee.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-230907P1161663608/2023/09/07/rev1/20230907084352-344db241bcad472883963f6f066d372d.json",
          jitemAnimalPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/JI-230907P1161663608/2023/09/07/rev1/20230907084352-69e5081206d342e4808abd41d4fa9654.png",
          jitemAnimalAudioPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/audio/JI-230907P1161663608/2023/09/07/rev1/20230907084352-88d202ad7f694767a1accfa4508471e9.mp3",
          animalInfo: {
            habitat: "호주 동부",
            eating: "초식성 (유칼리 나무 잎)",
            feature:
              "<p>⦁ 거의 나무 위에서 생활함</p><p>⦁ 하루에 보통 20시간을 자고 나머지 시간에는 먹이를 먹음</p><p>⦁ 배에 아기주머니가 있어서 새끼를 낳으면 아기주머니에서 키움</p>",
          },
        },
        {
          jitemId: "JI-230907P4725668206",
          catgryId: "JC-23012602050000000",
          jitemOrds: 8,
          jitemTp: "G",
          jitemNm: "시베리아호랑이",
          jitemCnt: 0,
          price: 20,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-230907P4725668206/2023/09/07/rev1/20230907083325-4b383bb93dfc46d188b0301b86a47898.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-230907P4725668206/2023/09/07/rev1/20230907083325-5b4e470f7e79498489361037382829f5.json",
          jitemAnimalPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/JI-230907P4725668206/2023/09/07/rev1/20230907083325-cd5b64abc84f4c18b879eebb9935922d.png",
          jitemAnimalAudioPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/audio/JI-230907P4725668206/2023/09/07/rev1/20230907083325-c0a9212ca3f342a99c2423a637cb917f.mp3",
          animalInfo: {
            habitat: "러시아, 중국, 북한 등의 산 속",
            eating: "육식성 (멧돼지, 사슴, 산양, 토끼 등)",
            feature:
              "<p>⦁&nbsp;호랑이 중에 가장 몸집이 크고, 검은 줄무늬가 있음&nbsp;</p><p>⦁&nbsp;야행성으로 주로 밤에 사냥함&nbsp;</p><p>⦁ 무리를 이루지 않고 혼자 생활함&nbsp;</p>",
          },
        },
        {
          jitemId: "JI-230907P1420467460",
          catgryId: "JC-23012602050000000",
          jitemOrds: 9,
          jitemTp: "G",
          jitemNm: "붉은캥거루",
          jitemCnt: 0,
          price: 10,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-230907P1420467460/2023/09/07/rev1/20230907083114-b27dea095efa445599dc658fd59f0a8a.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-230907P1420467460/2023/09/07/rev1/20230907083114-100b6ef436994996a2685c9ea8b7891e.json",
          jitemAnimalPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/JI-230907P1420467460/2023/09/07/rev1/20230907083114-d86dd704924447eb862b9d5695ae3434.png",
          jitemAnimalAudioPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/audio/JI-230907P1420467460/2023/09/07/rev1/20230907083114-289e846218274b23818652997bf4c4f3.mp3",
          animalInfo: {
            habitat: "호주의 내륙지역",
            eating: "초식성 (풀, 과일, 나뭇잎 등)",
            feature:
              "<p>⦁&nbsp;튼튼한 다리로 한번에 높고, 멀리 뛸 수 있음&nbsp;</p><p>⦁ 시력과 청력이 발달됨&nbsp;&nbsp;</p><p>⦁&nbsp;암컷은 아랫배에 아기주머니가 있어서 새끼를 낳으면 아기주머니에서 키움&nbsp;</p>",
          },
        },
        {
          jitemId: "JI-230907P2428676203",
          catgryId: "JC-23012602050000000",
          jitemOrds: 10,
          jitemTp: "G",
          jitemNm: "스컹크",
          jitemCnt: 0,
          price: 10,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-230907P2428676203/2023/09/07/rev1/20230907082905-72707ba3e18f4e8b832f8c16f7538a03.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-230907P2428676203/2023/09/07/rev1/20230907082905-9059c8d2088244b885484cdc24eabd50.png",
          jitemAnimalPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/JI-230907P2428676203/2023/09/07/rev1/20230907082905-4544b74af95d42279fd12bb97249480e.png",
          jitemAnimalAudioPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/audio/JI-230907P2428676203/2023/09/07/rev1/20230907082905-7ff9621365e74d0cb180f7d864e2a845.mp3",
          animalInfo: {
            habitat: "아메리카의 삼림, 초원, 사막지역 등",
            eating: "잡식성 (곤충, 개구리, 새알, 과일 등)",
            feature:
              "<p>⦁ 검은색 바탕에 하얀색 줄무늬나 점이 있음</p><p>⦁ 혼자서 생활하며 바위틈, 나무 구멍, 땅굴, 동굴 등에서 생활함</p><p>⦁ 항문 근처에 있는 항문선에서 지독한 냄새가 나는 액체를 발사할 수 있음&nbsp;</p>",
          },
        },
        {
          jitemId: "JI-230803P8636896183",
          catgryId: "JC-23012602050000000",
          jitemOrds: 11,
          jitemTp: "G",
          jitemNm: "다람쥐",
          jitemCnt: 0,
          price: 7,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-230803P8636896183/2023/08/03/rev1/20230803091322-ec9806cff6b4453587900fdeaa3c3d44.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-230803P8636896183/2023/08/03/rev1/20230803091322-29cd3565f9d64a9e8f84ab68004dee25.json",
          jitemAnimalPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/JI-230803P8636896183/2023/08/03/rev1/20230803091322-81213f5c86654d3595accf5c9f028e18.png",
          jitemAnimalAudioPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/audio/JI-230803P8636896183/2023/08/03/rev1/20230803091322-441160a91d974f5d8071628aa708b2d2.mp3",
          animalInfo: {
            habitat: "북아메리카와 동아시아 북동부",
            eating: "잡식성 (곡물, 견과류, 곤충 등)",
            feature:
              "<p>⦁ 볼주머니에 먹이를 저장해 둘 수 있음</p><p>⦁ 나무나 땅에 굴을 파서 지냄</p><p>⦁ 이빨이 계속 자라기 때문에 단단한 견과류 등을 갉아 이빨을 관리함</p><div><br></div>",
          },
        },
        {
          jitemId: "JI-230803P9552581849",
          catgryId: "JC-23012602050000000",
          jitemOrds: 12,
          jitemTp: "G",
          jitemNm: "붉은 여우",
          jitemCnt: 0,
          price: 10,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-230803P9552581849/2023/08/03/rev1/20230803091452-f4e8201c12624cf2b16ca2c642ed5515.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-230803P9552581849/2023/08/03/rev1/20230803091452-96ae4700c4ae467191edfaccd45de042.json",
          jitemAnimalPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/JI-230803P9552581849/2023/08/03/rev1/20230803091453-c3e96a964fb140408da44317ede5d015.png",
          jitemAnimalAudioPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/audio/JI-230803P9552581849/2023/08/03/rev1/20230803091453-2e2d1f16092541718f3588093304ecf6.mp3",
          animalInfo: {
            habitat: "한국을 비롯한 전세계에 퍼져있음",
            eating: "잡식성 (고라니, 쥐, 새, 곤충, 열매 등)",
            feature:
              "<p>⦁ 주둥이는 길고 뾰족하고, 다리는 길고 가늚</p><p>⦁ 몸에 비해 꼬리는 길고 굵으며 털이 많음</p><p>⦁ 단독 또는 암수 한 쌍이 함께 생활함</p>",
          },
        },
        {
          jitemId: "JI-230803P1628291908",
          catgryId: "JC-23012602050000000",
          jitemOrds: 13,
          jitemTp: "G",
          jitemNm: "로랜드고릴라",
          jitemCnt: 0,
          price: 20,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-230803P1628291908/2023/08/03/rev1/20230803091624-bfe9eef0c08647278a4c843d051f35cf.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-230803P1628291908/2023/08/03/rev1/20230803091624-ddcc47fdd95140108a6be222661859cb.png",
          jitemAnimalPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/JI-230803P1628291908/2023/08/03/rev1/20230803091624-39bfc129340f4b4ba97c26396d214b9a.png",
          jitemAnimalAudioPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/audio/JI-230803P1628291908/2023/08/03/rev1/20230803091624-700839c99dca4e64bbcb4475998e7cd9.mp3",
          animalInfo: {
            habitat: "아프리카의 열대우림",
            eating: "초식성 (나뭇잎, 줄기, 열매 등)",
            feature:
              "<p>⦁ 침팬지, 오랑우탄, 원숭이 들 중 몸집이 가장 큼</p><p>⦁ 성격이 온순함</p><p>⦁ 20 ~ 30 마리가 무리를 지어서 생활함</p>",
          },
        },
        {
          jitemId: "JI-230803P7711139042",
          catgryId: "JC-23012602050000000",
          jitemOrds: 14,
          jitemTp: "G",
          jitemNm: "타이완꽃사슴",
          jitemCnt: 0,
          price: 10,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-230803P7711139042/2023/08/03/rev1/20230803091845-8feb0d7a172147b0981975c1d0ba0559.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-230803P7711139042/2023/08/03/rev1/20230803091845-e7c99d001916416b8a886f438ae969ac.json",
          jitemAnimalPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/JI-230803P7711139042/2023/08/03/rev1/20230803091846-58f6ca930a164d3a91ab57723cb0f54b.png",
          jitemAnimalAudioPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/audio/JI-230803P7711139042/2023/08/03/rev1/20230803091846-9317faa115894fcba57fe90d70547bc7.mp3",
          animalInfo: {
            habitat: "대만의 산악지대",
            eating: "초식성 (풀, 과일, 나뭇잎 등)",
            feature:
              "<p>⦁ 갈색털이 나고, 등에는 하얀 반점이 있음</p><p>⦁ 작은 무리를 지어서 함께 생활함</p><p>⦁ 수컷은 매년 뿔갈이를 하는데, 봄에 뿔이 나고 가을까지 자라서 떨어짐</p>",
          },
        },
        {
          jitemId: "JI-230803P3596346882",
          catgryId: "JC-23012602050000000",
          jitemOrds: 15,
          jitemTp: "G",
          jitemNm: "흰코뿔소",
          jitemCnt: 0,
          price: 20,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-230803P3596346882/2023/08/03/rev1/20230803092016-e0d7437d64eb4189bab3e7a7a96018c7.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-230803P3596346882/2023/08/03/rev1/20230803092016-02d6f6811eb74a71b131949105c11be0.png",
          jitemAnimalPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/JI-230803P3596346882/2023/08/03/rev1/20230803092016-6f14a5e17b29455a8a25daedf652648d.png",
          jitemAnimalAudioPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/audio/JI-230803P3596346882/2023/08/03/rev1/20230803092016-e5e58a8cc46a46529e34e562a571e1bb.mp3",
          animalInfo: {
            habitat: "아프리카의 초원지대",
            eating: "초식성 (식물의 잎, 작은가지 등)",
            feature:
              "<p>⦁ 몸집이 크고, 코에 피부가 변해서 생겨난 2개의 뿔이 있음</p><p>⦁ 시력이 약하고, 후각, 청각이 발달함</p><p>⦁ 땀샘이 없어서 몸을 시원하게 하고, 기생충을 막기 위해 몸에 진흙을 묻힘</p><p>⦁ 2~5 마리가 무리를 지어서 생활함</p>",
          },
        },
        {
          jitemId: "JI-230607Q4511836100",
          catgryId: "JC-23012602050000000",
          jitemOrds: 16,
          jitemTp: "G",
          jitemNm: "기린",
          jitemCnt: 0,
          price: 20,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-230607Q4511836100/2023/06/07/rev1/20230607175857-44be5736a3c04d32b66882291c945434.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-230607Q4511836100/2023/06/08/rev2/20230608152722-7c9aabd154514fee8b295e76f3869d98.json",
          jitemAnimalPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/JI-230607Q4511836100/2023/06/07/rev1/20230607175857-fd6674f017cf4b808457ae9ee7745f3d.png",
          jitemAnimalAudioPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/audio/JI-230607Q4511836100/2023/06/07/rev1/20230607175857-608c090c271f4f1299a87faa32e87ed0.mp3",
          animalInfo: {
            habitat: "아프리카의 초원지대",
            eating: "초식성 (풀, 나뭇잎), 물을 잘 마시지 않음",
            feature:
              "<p>⦁ 땅에 사는 동물 중에 가장 키가 큼</p><p>⦁ 주로 서서 잠을 잠</p><p>⦁ 작은 무리를 지어서 생활함</p>",
          },
        },
        {
          jitemId: "JI-230607Q9940020783",
          catgryId: "JC-23012602050000000",
          jitemOrds: 17,
          jitemTp: "G",
          jitemNm: "긴꼬리원숭이",
          jitemCnt: 0,
          price: 10,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-230607Q9940020783/2023/06/07/rev1/20230607175654-db8dd261c9024b44b5419edd42a53e9b.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-230607Q9940020783/2023/06/07/rev1/20230607175654-dc4c937cb4714201b09e2a9a0da3abc6.png",
          jitemAnimalPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/JI-230607Q9940020783/2023/06/07/rev1/20230607175654-9cd161d5b9eb470fbdf563278861e760.png",
          jitemAnimalAudioPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/audio/JI-230607Q9940020783/2023/06/07/rev1/20230607175654-0442094f0fc34c6f907f81da7a99d404.mp3",
          animalInfo: {
            habitat: "아프리카, 아시아",
            eating: "초식성 (과일, 씨앗, 잎 등)",
            feature:
              "<p>⦁ 긴 뒷다리와 긴 꼬리가 있음</p><p>⦁ 꼬리로 물건을 잡거나, 몸의 균형을 잡을 때 유용함</p><p>⦁ 수십 ~ 수백 마리가 무리를 지어서 생활함</p>",
          },
        },
        {
          jitemId: "JI-230607Q8408761077",
          catgryId: "JC-23012602050000000",
          jitemOrds: 18,
          jitemTp: "G",
          jitemNm: "아시아코끼리",
          jitemCnt: 0,
          price: 20,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-230607Q8408761077/2023/06/07/rev1/20230607174421-ae7fc2d1f8ef493cbaab2a5188462b5d.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-230607Q8408761077/2023/06/07/rev1/20230607174422-1bbe8b3867cb45b68d863a5bd3c4a5d7.json",
          jitemAnimalPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/JI-230607Q8408761077/2023/06/07/rev1/20230607174422-67b5effb2ffb4c6ebad3295ed0dc1e45.png",
          jitemAnimalAudioPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/audio/JI-230607Q8408761077/2023/06/07/rev1/20230607174422-b04f3e488da643b6ba277004f18aeadf.mp3",
          animalInfo: {
            habitat: "아프리카, 인도, 중국, 태국 등의 산림, 사바나",
            eating: "초식성 (식물, 나뭇잎, 대나무, 풀 등)",
            feature:
              "<p>⦁ 땅에 사는 동물 중 가장 몸집이 크고, 긴 코를 가지고 있음</p><p>⦁ 시력은 약하지만 후각, 청각이 발달함</p><p>⦁ 진흙 목욕으로 몸을 쇠파리나 진드기로부터 보호함</p><p>⦁ 암컷을 중심으로 무리를 지어서 생활함</p>",
          },
        },
        {
          jitemId: "JI-230607Q8709237314",
          catgryId: "JC-23012602050000000",
          jitemOrds: 19,
          jitemTp: "G",
          jitemNm: "얼룩말",
          jitemCnt: 0,
          price: 20,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-230607Q8709237314/2023/06/07/rev1/20230607172909-79749ff35dfb4512ba0918ed80c44f53.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-230607Q8709237314/2023/06/07/rev1/20230607172909-3e46823b892b45d4948c65f848832a33.png",
          jitemAnimalPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/JI-230607Q8709237314/2023/06/07/rev1/20230607172909-d861dfbe78f6426c85074a3eec742ee9.png",
          jitemAnimalAudioPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/audio/JI-230607Q8709237314/2023/06/07/rev1/20230607172909-bad348d3c2414ea1b2ba8757eea9a638.mp3",
          animalInfo: {
            habitat: "아프리카의 사바나 지역",
            eating: "초식성 (풀, 나뭇잎)",
            feature:
              "<p>⦁ 몸에 검고 흰 얼룩 무늬가 있음</p><p>⦁ 몸에 비해 머리가 크고, 꼬리 끝에 긴 털이 있음</p><p>⦁ 수십 마리가 무리를 지어서 생활함</p>",
          },
        },
        {
          jitemId: "JI-230607Q1562477246",
          catgryId: "JC-23012602050000000",
          jitemOrds: 20,
          jitemTp: "G",
          jitemNm: "인도공작(청색)",
          jitemCnt: 0,
          price: 20,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-230607Q1562477246/2023/06/07/rev1/20230607172545-add0c31f66ee4d579c34b43caf5c747d.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-230607Q1562477246/2023/06/07/rev1/20230607172546-70953a1a793541ae97a2e0f2fa2b2624.json",
          jitemAnimalPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/JI-230607Q1562477246/2023/06/07/rev1/20230607172546-f1e55d4c1033470cb942c96fa9fcad9f.png",
          jitemAnimalAudioPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/audio/JI-230607Q1562477246/2023/06/07/rev1/20230607172546-83bed574167e41d090c893fe73a16866.mp3",
          animalInfo: {
            habitat: "인도, 동남아시아, 말레이시아 등",
            eating: "잡식성 (곡류, 과일, 지네, 곤충 등)",
            feature:
              "<p>⦁ 머리 위에 부채 모양의 장식 깃이 있음</p><p>⦁ 수컷은 화려한 청색, 암컷은 갈색임&nbsp;</p><p>⦁ 수컷은 화려한 위꼬리덮깃을 부채 모양으로 펼쳐 자신을 과시함</p>",
          },
        },
        {
          jitemId: "JI-231005P2474727068",
          catgryId: "JC-23012602050000000",
          jitemOrds: 21,
          jitemTp: "G",
          jitemNm: "토끼",
          jitemCnt: 0,
          price: 7,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-231005P2474727068/2023/10/05/rev1/20231005084631-02a36e9435b843338fce614ea45b598e.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-231005P2474727068/2023/10/05/rev1/20231005084631-88427af9a2b640d6a6c37ef0cced62e4.json",
          jitemAnimalPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/JI-231005P2474727068/2023/10/05/rev1/20231005084631-3ae6d4a2918c4253a5411dbed7dc72ed.png",
          jitemAnimalAudioPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/audio/JI-231005P2474727068/2023/10/05/rev1/20231005084631-a3767c73734041009c5b218f1470cc23.mp3",
          animalInfo: {
            habitat: "한국을 비롯한 전세계에 퍼져있음",
            eating: "초식성 (풀, 과일 등)",
            feature:
              '<div class="ewa-rteLine" style="font-family: " 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"=""><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">⦁</span><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">&nbsp;</span>귀가 길고 꼬리가 짧음</div><div class="ewa-rteLine" style="font-family: " 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"=""><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">⦁</span><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">&nbsp;</span>귀로 체온조절 함</div><div class="ewa-rteLine" style="font-family: " 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"=""><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">⦁</span><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">&nbsp;</span>이빨이 계속 자라기 때문에 단단한 나무 껍질을 갉아 이빨을 관리함</div><div class="ewa-rteLine" style="font-family: " 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"=""><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">⦁</span><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">&nbsp;</span>앞다리에 비해 뒷다리가 길고 튼튼함</div>',
          },
        },
        {
          jitemId: "JI-231005P6148779582",
          catgryId: "JC-23012602050000000",
          jitemOrds: 22,
          jitemTp: "G",
          jitemNm: "쌍봉낙타",
          jitemCnt: 1,
          price: 20,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-231005P6148779582/2023/10/05/rev1/20231005092529-106ffcf75dfc4b329f0cf34c7af3b36b.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-231005P6148779582/2023/10/05/rev1/20231005092529-b223bc85e27c4d0d9e25b9c943cabccd.png",
          jitemAnimalPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/JI-231005P6148779582/2023/10/05/rev1/20231005092529-08bc2070b37247a0a1063296c0262224.png",
          jitemAnimalAudioPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/audio/JI-231005P6148779582/2023/10/05/rev1/20231005092529-1d017b9649dc48c0b63af8ddaa9dc23b.mp3",
          animalInfo: {
            habitat: "중앙아시아 및 몽골의 사막지대, 초원",
            eating: "초식성 (풀, 과일, 나뭇잎)",
            feature:
              '<div class="ewa-rteLine" style="font-family: " 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"=""><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">⦁ </span>등에 2개의 혹이 있음</div><div class="ewa-rteLine" style="font-family: " 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"=""><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">⦁ </span>혹에 지방이 저장돼 있어서, 며칠 동안 먹이를 먹지 않아도 살 수 있음</div><div class="ewa-rteLine" style="font-family: " 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"=""><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">⦁ </span>사막의 모래가 들어가지 않게 콧구멍을 열고 닫을 수 있음</div><div class="ewa-rteLine" style="font-family: " 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"=""><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">⦁ </span>뜨거운 모래 위를 잘 걸을 수 있는 넓적한 발바닥이 있음</div>',
          },
        },
        {
          jitemId: "JI-231005P7569196191",
          catgryId: "JC-23012602050000000",
          jitemOrds: 23,
          jitemTp: "G",
          jitemNm: "두발가락나무늘보",
          jitemCnt: 1,
          price: 20,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-231005P7569196191/2023/10/05/rev1/20231005092728-3b7e91c76d294e9084aeaa261c8a771d.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-231005P7569196191/2023/10/05/rev1/20231005092728-562df724d96846f89d469cd4b151b2cc.png",
          jitemAnimalPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/JI-231005P7569196191/2023/10/05/rev1/20231005092728-cf4ce1b539a241d5a02456574855809d.png",
          jitemAnimalAudioPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/audio/JI-231005P7569196191/2023/10/05/rev1/20231005092728-d3e8f4151e304f07a92165ee9fbb1433.mp3",
          animalInfo: {
            habitat: "브라질, 멕시코 남부의 열대 밀림지대",
            eating: "초식성 (나뭇잎, 작은 나뭇가지, 과일, 곤충, 작은 동물 등)",
            feature:
              '<div class="ewa-rteLine" style="font-family: " 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"=""><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">⦁</span><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">&nbsp;</span>동물들 중 가장 느린 동물</div><div class="ewa-rteLine" style="font-family: " 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"=""><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">⦁</span><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">&nbsp;</span>나뭇가지에 거꾸로 매달려 먹고, 자고, 새끼도 낳는 등 대부분의 생활을 함</div><div class="ewa-rteLine" style="font-family: " 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"=""><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">⦁</span><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">&nbsp;</span>앞발가락이 2개인 두발가락나무늘보, 3개인 세발가락나무늘보가 있음 (뒷발가락은 모두 3개)</div>',
          },
        },
        {
          jitemId: "JI-231005P5810716945",
          catgryId: "JC-23012602050000000",
          jitemOrds: 24,
          jitemTp: "G",
          jitemNm: "늑대",
          jitemCnt: 1,
          price: 20,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-231005P5810716945/2023/10/05/rev1/20231005092910-0afae8a47f1f4ed6998ece232b370f8c.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-231005P5810716945/2023/10/05/rev1/20231005092910-68b9e4f3c3554a28b4fb2b778ddfabd2.json",
          jitemAnimalPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/JI-231005P5810716945/2023/10/05/rev1/20231005092910-852e5e55f5054e1995ffeb6b0746b0c9.png",
          jitemAnimalAudioPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/audio/JI-231005P5810716945/2023/10/05/rev1/20231005092910-1533bff0eebe452c8fa9916469b4e88d.mp3",
          animalInfo: {
            habitat: "몽골, 시베리아, 인도 등 북반구 전체의 삼림지대",
            eating: "육식성 (사슴, 양, 쥐 등)",
            feature:
              '<div class="ewa-rteLine" style="font-family: " 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"=""><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">⦁</span><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">&nbsp;</span>후각이 발달해서 멀리 떨어진 냄새도 잘 맡을 수 있음</div><div class="ewa-rteLine" style="font-family: " 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"=""><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">⦁</span><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">&nbsp;</span>울음소리로 의사소통을 함</div><div class="ewa-rteLine" style="font-family: " 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"=""><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">⦁</span><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">&nbsp;</span>야행성이고, 2~8 마리가 무리 지어 생활함</div>',
          },
        },
        {
          jitemId: "JI-231005P3567364473",
          catgryId: "JC-23012602050000000",
          jitemOrds: 25,
          jitemTp: "G",
          jitemNm: "민며느리발톱거북",
          jitemCnt: 0,
          price: 10,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-231005P3567364473/2023/10/05/rev1/20231005093111-562dcd0aac204b118bc52bbbb30a9e64.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-231005P3567364473/2023/10/05/rev1/20231005093111-705d1f9f82f84b648aa8e10d698fead7.png",
          jitemAnimalPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/JI-231005P3567364473/2023/10/05/rev1/20231005093111-c6a23628dc52451d848c3245cb33b9d7.png",
          jitemAnimalAudioPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/audio/JI-231005P3567364473/2023/10/05/rev1/20231005093111-2d84b1c4fd8b4173b3eafa919f80e2e7.mp3",
          animalInfo: {
            habitat: "사하라 사막 남부",
            eating: "초식성 (풀, 선인장 등)",
            feature:
              '<div class="ewa-rteLine" style="font-family: " 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"=""><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">⦁</span><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">&nbsp;</span>세계에서 3번째로 큰 육지거북</div><div class="ewa-rteLine" style="font-family: " 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"=""><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">⦁</span><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">&nbsp;</span>움직임이 매우 느림</div><div class="ewa-rteLine" style="font-family: " 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"=""><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">⦁</span><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">&nbsp;</span>더위를 피해 모래 속에 굴을 파고 들어가서 쉬기도 함</div>',
          },
        },
        {
          jitemId: "JI-231102P3170048330",
          catgryId: "JC-23012602050000000",
          jitemOrds: 26,
          jitemTp: "G",
          jitemNm: "하마",
          jitemCnt: 0,
          price: 20,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-231102P3170048330/2023/11/02/rev1/20231102094614-616130a6525349b78d217c3e5141bc0b.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-231102P3170048330/2023/11/02/rev1/20231102094614-8667470b6e47436a8038511cda2db658.png",
          jitemAnimalPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/JI-231102P3170048330/2023/11/02/rev1/20231102094614-3ae086f8a498402cbe0120ed7a9a160f.png",
          jitemAnimalAudioPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/audio/JI-231102P3170048330/2023/11/02/rev1/20231102094614-2b0aeb046ff34bfabd84f585eadc91a5.mp3",
          animalInfo: {
            habitat: "아프리카 초원지대의 강과 호수",
            eating: "초식성 (풀, 나뭇잎, 과일)",
            feature:
              '<div class="ewa-rteLine" style="font-family: " 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"=""><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">⦁</span><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">&nbsp;</span>햇빛에 굉장히 약해서 낮에는 호수나 늪 속에서 지냄</div><div class="ewa-rteLine" style="font-family: " 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"=""><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">⦁</span><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">&nbsp;</span>콧구멍은 물 속에서 쉽게 여닫을 수 있고, 커다란 아래턱과 송곳니가 있음</div><div class="ewa-rteLine" style="font-family: " 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"=""><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">⦁</span><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">&nbsp;</span>20마리 이상이 무리를 지어서 생활함</div>',
          },
        },
        {
          jitemId: "JI-231102P9802479137",
          catgryId: "JC-23012602050000000",
          jitemOrds: 27,
          jitemTp: "G",
          jitemNm: "악어",
          jitemCnt: 0,
          price: 20,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-231102P9802479137/2023/11/02/rev1/20231102094832-b85585d38a724ee1b760743da39336d9.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-231102P9802479137/2023/11/02/rev2/20231102095716-2e82554b1c754e3993382f99e235be6d.json",
          jitemAnimalPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/JI-231102P9802479137/2023/11/02/rev1/20231102094832-0d9168239e9a464a87c99a683aec44cb.png",
          jitemAnimalAudioPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/audio/JI-231102P9802479137/2023/11/02/rev1/20231102094832-ffa595198b1741a4ae6ca8e911618fb9.mp3",
          animalInfo: {
            habitat: "아시아, 아프리카, 아메리카 등",
            eating: "육식성 (물고기, 작은 동물 등)",
            feature:
              '<div class="ewa-rteLine" style="font-family: " 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"=""><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">⦁&nbsp;</span>날카로운 이빨이 조밀하게 나 있고, 턱의 힘이 아주 강함</div><div class="ewa-rteLine" style="font-family: " 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"=""><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">⦁&nbsp;</span>머리부터 꼬리까지 단단한 비늘판으로 덮여 있음</div><div class="ewa-rteLine" style="font-family: " 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"=""><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">⦁&nbsp;</span>발가락 사이에는 물갈퀴가 있음</div>',
          },
        },
        {
          jitemId: "JI-231102P3863693128",
          catgryId: "JC-23012602050000000",
          jitemOrds: 28,
          jitemTp: "G",
          jitemNm: "사막여우",
          jitemCnt: 0,
          price: 20,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-231102P3863693128/2023/11/02/rev1/20231102095237-31f7610084e7473a86f9ce12a3327413.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-231102P3863693128/2023/11/02/rev1/20231102095237-dacb009aadd440ca89fd4a25d1c9422f.png",
          jitemAnimalPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/JI-231102P3863693128/2023/11/02/rev1/20231102095237-fb31a2cfe8f84a928957bf2f6a6238de.png",
          jitemAnimalAudioPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/audio/JI-231102P3863693128/2023/11/02/rev1/20231102095237-4f8a12fb8d044875bd38bd2980a8e3e5.mp3",
          animalInfo: {
            habitat: "아프리카의 사막",
            eating: "잡식성 (과일, 전갈, 흰개미, 뱀, 쥐 등)",
            feature:
              '<div class="ewa-rteLine" style="font-family: " 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"=""><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">⦁</span><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">&nbsp;</span>사막에 엄청 긴 모래 굴을 만들어 10마리 정도가 무리를 지어서 생활함</div><div class="ewa-rteLine" style="font-family: " 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"=""><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">⦁</span><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">&nbsp;</span>얇고 큰 귀는 열을 바깥으로 잘 보낼 수 있음</div><div class="ewa-rteLine" style="font-family: " 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"=""><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">⦁</span><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">&nbsp;</span>발바닥에 털이 나 있어서 사막에서도 발이 잘 빠지지 않고 걸어다닐 수 있음</div>',
          },
        },
        {
          jitemId: "JI-231102P5856061666",
          catgryId: "JC-23012602050000000",
          jitemOrds: 29,
          jitemTp: "G",
          jitemNm: "큰뿔양",
          jitemCnt: 0,
          price: 20,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-231102P5856061666/2023/11/02/rev1/20231102095618-ccc2467a88f745dcba2148061e0b2dce.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-231102P5856061666/2023/11/02/rev1/20231102095618-0406417abcef41748c3a7ac09099c922.png",
          jitemAnimalPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/JI-231102P5856061666/2023/11/02/rev1/20231102095618-80af8952fb6848ea99105479317a2b74.png",
          jitemAnimalAudioPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/audio/JI-231102P5856061666/2023/11/02/rev1/20231102095618-d827c377b0df447c83728a7bcb1b2e06.mp3",
          animalInfo: {
            habitat: "북아메리카, 시베리아 등의 산악지대",
            eating: "초식성 (풀, 과일, 나뭇잎 등)",
            feature:
              '<div class="ewa-rteLine" style="font-family: " 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"=""><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">⦁</span><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">&nbsp;</span>야생양 중에서 가장 몸집이 큼</div><div class="ewa-rteLine" style="font-family: " 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"=""><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">⦁</span><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">&nbsp;</span>수컷의 뿔 길이는 1m 이상이고, 뒷편으로 동그랗게 말려서 끝이 밖으로 향함 </div><div class="ewa-rteLine" style="font-family: " 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"=""><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">⦁</span><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">&nbsp;</span>10여 마리 정도가 무리를 지어서 생활함</div>',
          },
        },
        {
          jitemId: "JI-231102P8688818401",
          catgryId: "JC-23012602050000000",
          jitemOrds: 30,
          jitemTp: "G",
          jitemNm: "미어캣",
          jitemCnt: 0,
          price: 10,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-231102P8688818401/2023/11/02/rev1/20231102095942-91df4c43940542af8c9d8c42f37625b5.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-231102P8688818401/2023/11/02/rev1/20231102095942-c26f76dfafa54146a5f9a4dcaf7a4ef4.json",
          jitemAnimalPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/JI-231102P8688818401/2023/11/02/rev1/20231102095942-18d114ac4b224e0f8fde98ec222993ce.png",
          jitemAnimalAudioPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/animal/audio/JI-231102P8688818401/2023/11/02/rev1/20231102095942-47aa0808a2ed4b609b22fdde453a0b66.mp3",
          animalInfo: {
            habitat: "남아프리카",
            eating: "잡식성 (곤충, 전갈, 작은 파충류 등)",
            feature:
              '<div class="ewa-rteLine" style="font-family: " 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"=""><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">⦁</span><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">&nbsp;</span>독에 면역이 있어서 전갈이나 뱀을 먹어도 중독되지 않음</div><div class="ewa-rteLine" style="font-family: " 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"=""><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">⦁</span><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">&nbsp;</span>수십 마리가 무리를 지어서 굴 속에서 생활함</div><div class="ewa-rteLine" style="font-family: " 맑은="" 고딕";="" font-size:="" 13.3333px;="" white-space-collapse:="" preserve;="" background-color:="" rgb(255,="" 255,="" 255);"=""><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">⦁</span><span style="font-family: 돋움, Dotum, Helvetica, sans-serif; font-size: 12px;">&nbsp;</span>낮에는 밖으로 나와 두 발로 서서 햇볕을 쬐거나, 주변을 경계함</div>',
          },
        },
      ],
    },
    {
      catgryId: "JC-23012602030000000",
      catgryOrds: 3,
      catgryNm: "식음료 가게",
      catgryThumbPath:
        "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/category/tab_store.png",
      jlandItem: [
        {
          jitemId: "JI-230607Q9607587635",
          catgryId: "JC-23012602030000000",
          jitemOrds: 6,
          jitemTp: "G",
          jitemNm: "솜사탕 가게",
          jitemCnt: 0,
          price: 10,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/thumbnail/JI-230607Q9607587635/2023/06/07/rev1/20230607183353-8957baa52bf84908abe3e6b23076d49b.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/JI-230607Q9607587635/2023/06/07/rev1/20230607183353-8dedb20be3f54974b78bed1c0034f0e4.json",
          jitemAnimalPath: null,
          jitemAnimalAudioPath: null,
          animalInfo: null,
        },
        {
          jitemId: "JI-23012603200000000",
          catgryId: "JC-23012602030000000",
          jitemOrds: 12,
          jitemTp: "G",
          jitemNm: "아이스크림 가게",
          jitemCnt: 0,
          price: 10,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/store/ani/Store_icecream_i.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/store/ani/Store_icecream.json",
          jitemAnimalPath: null,
          jitemAnimalAudioPath: null,
          animalInfo: null,
        },
        {
          jitemId: "JI-23012603220000000",
          catgryId: "JC-23012602030000000",
          jitemOrds: 14,
          jitemTp: "G",
          jitemNm: "풍선 가게",
          jitemCnt: 0,
          price: 10,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/store/ani/Store_balloon_i.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/store/ani/Store_balloon.json",
          jitemAnimalPath: null,
          jitemAnimalAudioPath: null,
          animalInfo: null,
        },
        {
          jitemId: "JI-23012603230000000",
          catgryId: "JC-23012602030000000",
          jitemOrds: 15,
          jitemTp: "G",
          jitemNm: "솜사탕 가게",
          jitemCnt: 0,
          price: 10,
          newYn: "N",
          jitemThumbPath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/store/ani/Store_cottencandy_i.png",
          jitemFilePath:
            "https://myolin-media.s3.ap-northeast-2.amazonaws.com/reward/joyland/item/store/ani/Store_cottencandy.json",
          jitemAnimalPath: null,
          jitemAnimalAudioPath: null,
          animalInfo: null,
        },
      ],
    },
  ];
  const reward = {
    objList: [
      {
        jitemId: "JI-231207P5468036686",
        o_idx: 1,
        y: 46.5,
        x: 0,
        catgryId: "JC-23012602020000000",
        scale: 1,
      },
    ],
  };

  const drawItems = async () => {
    if (!reward.objList) return;
    for await (const obj of reward.objList) {
      console.log(obj, "obj draw start");

      // const cnt = await updateCnt(obj.jitemId, obj.catgryId, "minus");
      // console.log(cnt);
      // if (cnt >= 0) {
      await addCanvasObj(obj, obj.catgryId);
      // } else {
      //   reward.objList = reward.objList.filter((e) => e.o_idx !== obj.o_idx);
      // }
    }
  };

  useEffect(() => {
    initCanvas();
    drawItems();
  }, []);
  return (
    <>
      <div>lottielottielottielottie</div>
      <canvas id="canvas"></canvas>
    </>
  );
}
