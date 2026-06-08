import { alpha, styled } from '@mui/material/styles';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { useQueryClient } from "@tanstack/react-query";
import { Button } from 'antd';
import { useState, type FC } from "react";
import { AiFillCloseSquare, AiTwotoneAudio } from "react-icons/ai";
import { IoAddCircleSharp } from "react-icons/io5";
import { useLocation } from 'react-router-dom';
import CardUserInfoNode from "../cardUserInfoNode";

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
const ComponentCardOnlineVisitors: FC<IProps> = (props) => {
    const { } = props
    const queryClient = useQueryClient();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const conversationId = queryParams.get("conversationId");
    const [pageSize, setPageSize] = useState<number>(200);
    const [pageIndex, _setPageIndex] = useState<number>(1);





    const onClickSee = () => {
        setPageSize((prev: any) => prev + 100)
    }
    return <>
        <SimpleTreeView
            aria-label="customized"
            defaultExpandedItems={['1a', '2b', `3c`]}
            selectedItems={conversationId?.toString()}
            slots={{
                expandIcon: ExpandIcon,
                collapseIcon: CollapseIcon,
                endIcon: EndIcon,

            }}
            sx={{ overflowX: 'hidden', flexGrow: 1, width: "100%" }}
        >
            <CustomTreeItem itemId="1a" label="khách truy cập trực tuyến">
                <CustomTreeItem itemId="2b" label="Đang online">

                    <CustomTreeItem itemId={"1"} label={<CardUserInfoNode item={{}} index={1} status='false' />} />

                </CustomTreeItem>
                <CustomTreeItem itemId="3c" label="Đang offline">

                    <CustomTreeItem itemId={"2"} label={<CardUserInfoNode item={{}} index={1} status='false' />} />

                </CustomTreeItem>
            </CustomTreeItem>
        </SimpleTreeView>
        <div className='flex items-center justify-end mx-4 my-3' ><Button onClick={onClickSee} style={{ width: '80%' }} >Xem thêm</Button></div>


    </>

}

export default ComponentCardOnlineVisitors