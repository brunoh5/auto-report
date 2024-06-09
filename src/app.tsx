import { useCallback, useState } from "react";
import { open } from "@tauri-apps/api/dialog";
import { readDir } from "@tauri-apps/api/fs";
import { resolve } from "@tauri-apps/api/path";
import painelImage from './assets/painel.jpg'
import { convertFileSrc } from "@tauri-apps/api/tauri";

export function App() {
  const [folder, setFolder] = useState('')
  const [images, setImages] = useState([
    { path: painelImage, fileName: 'painel' },
  ])

  const mergeArrays = useCallback((replaceArray: any) => {
    return images.map(mainObj => {
      const replaceObj = replaceArray.find((replace: any) => replace.fileName === mainObj.fileName);
      return {
        ...mainObj,
        ...replaceObj
      };
    });
  }, [images])

  async function reset() {
    setFolder('')
    setImages([
      { path: painelImage, fileName: 'painel' },
    ])
  }

  async function selectFolder() {
    const selected = await open({
      directory: true,
      multiple: false,
    })

    if (!selected) {
      return
    }

    if (Array.isArray(selected)) {
      return
    }

    setFolder(selected)

    const imageList: any = []

    const imagesInCache = await readDir(
      selected
    )

    imagesInCache.forEach(async (entry) => {
      imageList.push({
        /* @ts-ignore */
        filename: entry?.name.split('.')[0] ?? '',
        path: convertFileSrc(entry.path)
      })
    })

    console.log(imageList)

    const merged = mergeArrays(imageList)

    console.log(merged)

    setImages(merged)

    // const mappedContents = contents.map(async (content) => {
    //   if (content.name) {
    //     return Object.assign(content, {
    //       fileName: content?.name.split('.')[0],
    //       path: convertFileSrc(content.path)
    //     })
    //   }
    // })

    // const merged = mergeArrays(mappedContents)

    // setImages(merged)

    // console.log(mappedContents)
  }



  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  //   setGreetMsg(await invoke("greet", { name }));
  // }

  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>


      <button onClick={selectFolder}>Selecionar pasta</button>
      <button onClick={reset}>Resetar</button>

      {folder && <p>Pasta Selecionada: {folder}</p>}

      <div className='w-full px-6 h-auto'>
        <img src={images.find(image => image.fileName === 'painel')?.path} alt="" className='size-full object-contain' />
      </div>
    </div>
  );
}