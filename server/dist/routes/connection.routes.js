import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { sendFriendRequest, respondFriendRequest, removeFriend, cancelFriendRequest, followUser, unfollowUser, listFriends, listPendingRequests, listFollowingRecruiters, listFollowingMentors, getBulkFriendStatuses, getBulkFollowStatuses, } from "../controllers/connection.controller.js";
const router = Router();
router.use(authenticate, authorize("student"));
// ── Friends (two-way) ──
router.post("/friends/request", sendFriendRequest);
router.post("/friends/respond", respondFriendRequest);
router.post("/friends/remove", removeFriend);
router.post("/friends/cancel", cancelFriendRequest);
router.get("/friends", listFriends);
router.get("/friends/pending", listPendingRequests);
router.get("/friends/statuses", getBulkFriendStatuses);
// ── Follow (one-way) ──
router.post("/follow", followUser);
router.post("/unfollow", unfollowUser);
router.get("/following/recruiters", listFollowingRecruiters);
router.get("/following/mentors", listFollowingMentors);
router.get("/following/statuses", getBulkFollowStatuses);
export default router;
//# sourceMappingURL=connection.routes.js.map