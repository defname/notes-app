/**
 * BubbleMenu
 * A component to create a bubble menu.
 * Usage:
 * <BM>
 *  <BM.Menu>
 *    <BM.Trigger>
 *    </BM.Trigger>
 *  </BM.Menu>
 *  <BM.Menu>
 *    <BM.Items>
 *      <BM.Item></BM.Item>
 *      <BM.Item></BM.Item>
 *    </BM.Items>
 *    <BM.Trigger>
 *    </BM.Trigger>
 *  <BM.Menu>
 *  <BM.Menu>
 *    <BM.Items>
 *      <BM.Item></BM.Item>
 *      <BM.Item></BM.Item>
 *    </BM.Items>
 *    <BM.Trigger>
 *    </BM.Trigger>
 *  <BM.Menu>
 * </BM>
 */

import BubbleMenu from "./components/BubbleMenu"
import Menu from "./components/Menu"
import Item from "./components/Item"
import Trigger from "./components/Trigger"

type BubbleMenuType = typeof BubbleMenu & {Menu: typeof Menu, Item: typeof Item, Trigger: typeof Trigger}

(BubbleMenu as any).Menu = Menu;
(BubbleMenu as any).Item = Item;
(BubbleMenu as any).Trigger = Trigger;

export const BM: BubbleMenuType = BubbleMenu as BubbleMenuType

export default BubbleMenu as BubbleMenuType