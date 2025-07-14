import { RefObject, useEffect, useRef } from 'react';

/**
 * 指定した要素の外側をクリックした時にコールバックを実行するカスタムフック
 *
 * @param callback - 外側クリック時に実行する関数
 * @param enabled - フックを有効にするかどうか（デフォルト: true）
 * @returns
 */

export const useOutsideClick = <T extends HTMLElement = HTMLDivElement>(
  callback: () => void,
  enabled: boolean = true
): RefObject<T | null> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      // refが存在し、クリックされた要素がref内に含まれていない場合
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    // enabledがtrueの時のみイベントリスナーを追加
    if (enabled) {
      // マウスとタッチイベント両方に対応
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    // クリーンアップ
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [callback, enabled]);

  return ref;
};
