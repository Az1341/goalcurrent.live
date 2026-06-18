import GroupHubContent from "@/components/wc26/GroupHubContent";
import type { Wc26GroupId } from "@/data/wc26";

type GroupPageContentProps = {
  groupId: Wc26GroupId;
};

export default function GroupPageContent({ groupId }: GroupPageContentProps) {
  return <GroupHubContent groupId={groupId} />;
}
