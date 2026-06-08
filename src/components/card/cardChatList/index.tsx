import { alpha, styled } from '@mui/material/styles';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { Fragment, useCallback, useEffect, useState, type FC } from "react";
import { AiFillCloseSquare, AiTwotoneAudio } from "react-icons/ai";
import { IoAddCircleSharp } from "react-icons/io5";
import { useChatSocket } from '../../../hooks/useChatSocket';
import CardUserInfoNode from "../cardUserInfoNode";
import { IoMdSettings } from "react-icons/io";
import { Popover } from 'antd';
import { PiDotFill } from "react-icons/pi";
import { userAPI } from '../../../apis/user.api';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../redux/store';
import { CheckRole } from '../../../utils';

const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
    [`& .${treeItemClasses.content}`]: {
        padding: theme.spacing(0.5, 1),
        margin: theme.spacing(0.2, 0),
    },
    [`& .${treeItemClasses.iconContainer}`]: {
        '& .close': {
            opacity: 0.3,
        },
    },
    [`& .${treeItemClasses.groupTransition}`]: {
        marginLeft: 15,
        paddingLeft: 10,
        borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,

    },
}));

function ExpandIcon(props: React.PropsWithoutRef<typeof IoAddCircleSharp>) {
    return <IoAddCircleSharp {...props} className="opacity-80 text-[#0f447d] " />;
}

function CollapseIcon(props: React.PropsWithoutRef<typeof AiFillCloseSquare>) {
    return <AiFillCloseSquare {...props} className="opacity-80 text-red-600" />;
}

function EndIcon(props: React.PropsWithoutRef<typeof AiTwotoneAudio>) {
    return <AiTwotoneAudio {...props} className="opacity-70" />;
}
interface IProps {

}
const ComponentCardChatList: FC<IProps> = (props) => {
    const [data, setData] = useState<any>([]);













    return <Fragment>

        <SimpleTreeView
            aria-label="customized"
            defaultExpandedItems={['1']}

            // selectedItems={conversationId?.toString()}
            slots={{
                expandIcon: ExpandIcon,
                collapseIcon: CollapseIcon,
                endIcon: EndIcon,

            }}
            sx={{ overflowX: 'hidden', flexGrow: 1, width: "100%" }}
        >
            <CustomTreeItem itemId="1" label="Danh sách trò chuyện">

                <CustomTreeItem key={`_a`} itemId={`_a`} label={
                    <div className='flex items-center justify-between' >
                        <div>
                            item.full_name  <span className="text-green-700" >(online)</span>
                        </div>

                    </div>
                }>
                    <CustomTreeItem itemId={`_b`} label="Trò chuyện">

                        <CustomTreeItem
                            key={`1`}
                            itemId={`1`}
                            label={<CardUserInfoNode item={{}} index={1} status='true' />} />

                    </CustomTreeItem>
                </CustomTreeItem>

            </CustomTreeItem>
        </SimpleTreeView>
    </Fragment>
}

export default ComponentCardChatList