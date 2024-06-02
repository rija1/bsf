import { useEffect, useMemo, useRef, useState } from "preact/hooks"
import { MeowGalleryItem } from "../components/MeowGalleryItem"
import useMeowGalleryContext, { tilesRowClasses, tilesReferences } from "../context"

export const Tiles = () => {
  const ref = useRef(null)
  const { classId, className, inlineStyle, images, density } = useMeowGalleryContext()
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [rendered, setRendered] = useState(false)

  const currentDevice = useMemo(() => {
    const windowWidth = window.innerWidth
    if (windowWidth <= 460) {
      return 'mobile'
    }
    if (windowWidth <= 768) {
      return 'tablet'
    }
    return 'desktop'
  }, [windowWidth])
  const currentDensity = density[currentDevice]
  const rowClasses = tilesRowClasses[currentDensity]

  const getHeightByWidth = (width, orientation) => {
    const ratio = "three-two"
    if (orientation == 'landscape') {
      switch (ratio) {
        case 'three-two':
          return (2 * width) / 3
        case 'five-four':
          return (4 * width) / 5
      }
    } else {
      switch (ratio) {
        case 'three-two':
          return (3 * width) / 2
        case 'five-four':
          return (5 * width) / 4
      }
    }
  }

  const setRowLayout = (rows) => {
    let ooooLayoutVariant = 0
    return rows.map((row) => {
      let rowLayout = ''
      if (row === 'oooo') {
        if (ooooLayoutVariant === 3) {
          ooooLayoutVariant = 0
        }
        if (ooooLayoutVariant === 0) {
          rowLayout += `${row}-v0`
        } else {
          rowLayout += `${row}-v${ooooLayoutVariant}`
        }
        ooooLayoutVariant++
      } else {
        rowLayout += row
      }
      return {
        content: row,
        rowLayout
      }
    })
  }

  const rows = useMemo(() => {
    if (!images.length) {
      return []
    }
    const newRows = []
    let rowClass = ''
    images.forEach((galleryItem, index) => {
      const supposedRowClass = rowClass + galleryItem.orientation
      if (rowClasses.includes(supposedRowClass)) {
        rowClass = supposedRowClass
      } else {
        newRows.push(rowClass)
        rowClass = galleryItem.orientation
      }
      if (index === images.length - 1) {
        newRows.push(rowClass)
      }
    })
    if (newRows.length >= 2) {
      const lastIndex = newRows.length - 1
      const sencondToLastIndex = newRows.length - 2
      const lastRow = newRows[lastIndex].split('')
      const secondToLastRow = newRows[sencondToLastIndex].split('')
      if (lastRow.length === 1 && secondToLastRow.length > 2) {
        const secondToLastRowLastItem = secondToLastRow.pop()
        lastRow.unshift(secondToLastRowLastItem)
      }
      newRows[sencondToLastIndex] = secondToLastRow.join('')
      newRows[lastIndex] = lastRow.join('')
    }
    return setRowLayout(newRows)
  }, [images, rowClasses])


  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      document.body.dispatchEvent(new Event('post-load'))
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (rendered && ref.current && rows.length) {
      ref.current.querySelectorAll('.mgl-row').forEach((row) => {
        const layout = row.getAttribute('data-row-layout')
        const rowReference = tilesReferences[layout]
        const mglBox = row.querySelector(`.mgl-box.${rowReference.box}`)
        const height = getHeightByWidth(mglBox.offsetWidth, rowReference.orientation)
        if (height === 0) {
          setTimeout(() => {
            row.style.height = height + 'px'
          }, 750)
        } else {
          row.style.height = height + 'px'
        }
      })
    }
  }, [rendered, rows.length])

  useEffect(() => {
    setRendered(true)
  }, []);

  const freshInlineStyle = rendered ? { ...inlineStyle } : { ...inlineStyle, visibility: 'hidden', display: 'none' };

  return (
    <div ref={ref} id={classId} className={className} style={freshInlineStyle}>
      {rows.map((row, i) => {
        const { content, rowLayout } = row
        const startIndex = i === 0 ? 0 : rows.filter((_, index) => index < i).reduce((a, b) => a + b.content.length, 0)
        const rowItems = images.slice(startIndex, startIndex + content.length)

        return (
          <div className={`mgl-row mgl-layout-${content.length}-${rowLayout}`} data-row-layout={rowLayout}>
            {rowItems.map((rowItem, j) => {
              return (
                <div className={`mgl-box ${String.fromCharCode(97 + j)}`}>
                  <MeowGalleryItem image={rowItem} />
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}