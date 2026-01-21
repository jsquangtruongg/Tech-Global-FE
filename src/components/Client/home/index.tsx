import { useEffect, useState } from "react";
import { getAllPostsAPI, type IPost } from "../../../api/post";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import ImgPage from "../../../assets/images/Illustration.png";
import ImgOrganization from "../../../assets/images/Frame 35.png";
import panda from "../../../assets/images/pana.png";
import stock from "../../../assets/images/8-2-1900x1069.jpg";

import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import Diversity3OutlinedIcon from "@mui/icons-material/Diversity3Outlined";
import PlayCircleOutlinedIcon from "@mui/icons-material/PlayCircleOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import CreditScoreOutlinedIcon from "@mui/icons-material/CreditScoreOutlined";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import TonalityIcon from "@mui/icons-material/Tonality";
import WebhookIcon from "@mui/icons-material/Webhook";
const HomeComponent = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await getAllPostsAPI();
      if (res && res.err === 0) {
        setPosts(res.data);
      }
    };
    fetchPosts();
  }, []);

  return (
    <>
      <div className="home">
        <div className="home__container">
          <div className="home__container-left">
            <p className="txt-page">
              Tech Global hãy bắt đầu <br />
              <span className="txt-highlight">Hành trình của bạn</span>
            </p>
            <h1 className="txt-page-desc">
              Tech Global là một nền tảng công nghệ hàng đầu,chuyên gia phân
              tích & thông tin thị trường
            </h1>
            <div className="header-layout-item">
              <button className="btn-registration">Đăng ký</button>
            </div>
          </div>
          <div className="home__container-right">
            <img src={ImgPage} alt="img-page" className="img-page" />
          </div>
        </div>
        <div className="organization">
          <div className="our-client">
            <p className="txt-client">Các khách hàng của chúng tôi</p>
            <p className="line-client">
              Chúng tôi đã và đang hợp tác với một số khách hàng thuộc danh sách
              Fortune 500+
            </p>
            <div className="client-together"></div>
          </div>
          <div className="client-community">
            <p className="txt-community">
              Quản lý toàn bộ cộng đồng của bạn <br /> trong một hệ thống duy
              nhất.
            </p>
            <p className="line-community">
              Tech Global phù hợp với đối tượng nào?
            </p>
          </div>
          <div className="client-item">
            <div className="item-user">
              <div className="item-outline">
                <Diversity3OutlinedIcon className="user-icon" />
              </div>
              <p className="txt-organization">Các tổ chức thành viên</p>
              <p className="txt-desc">
                Phần mềm quản lý hội viên của chúng tôi cung cấp khả năng tự
                động hóa hoàn toàn việc gia hạn hội viên và thanh toán.
              </p>
            </div>
            <div className="item-user">
              <div className="item-outline">
                <TonalityIcon className="user-icon" />
              </div>
              <p className="txt-organization">Hiệp hội quốc gia</p>
              <p className="txt-desc">
                Phần mềm quản lý hội viên của chúng tôi cung cấp khả năng tự
                động hóa hoàn toàn việc gia hạn hội viên và thanh toán.
              </p>
            </div>
            <div className="item-user">
              <div className="item-outline">
                <WebhookIcon className="user-icon" />
              </div>
              <p className="txt-organization">Câu lạc bộ và nhóm</p>
              <p className="txt-desc">
                Phần mềm quản lý hội viên của chúng tôi cung cấp khả năng tự
                động hóa hoàn toàn việc gia hạn hội viên và thanh toán.
              </p>
            </div>
          </div>
          <div className="client-organization">
            <div className="item-organization">
              <div className="item-img">
                <img
                  src={ImgOrganization}
                  alt=""
                  className="img-organization"
                />
              </div>
              <div className="txt-organization">
                <p className="txt-organization-desc">
                  Những điều chưa được biết khi đến với
                  <br /> Tech Global
                </p>
                <p className="txt-desc-organization">
                  Phần mềm Chuyên viên Phân tích là giải pháp hỗ trợ toàn diện
                  cho việc thu thập, xử lý và phân tích dữ liệu một cách nhanh
                  chóng và chính xác. Phần mềm giúp chuyên viên dễ dàng theo
                  dõi, đánh giá và trực quan hóa thông tin, từ đó đưa ra các
                  quyết định kịp thời và hiệu quả. Với giao diện thân thiện, khả
                  năng tùy chỉnh linh hoạt và hệ thống báo cáo thông minh, phần
                  mềm đáp ứng tốt nhu cầu phân tích trong nhiều lĩnh vực, góp
                  phần nâng cao năng suất làm việc và chất lượng quản lý.
                </p>
                <button className="btn-more">Xem thêm</button>
              </div>
            </div>
          </div>
        </div>
        <div className="organization-index">
          <div className="txt-business">
            <div className="txt-business-content">
              <p className="txt-business-title">
                Giúp doanh nghiệp địa phương tái cấu trúc <br />
                <span className="txt-highlight">lại chính mình.</span>
              </p>
            </div>
            <p className="txt-business-desc">
              Chúng tôi đã đạt được thành quả này nhờ sự nỗ lực và cống hiến hết
              mình...
            </p>
          </div>
          <div className="icon-item">
            <div className="icon-outline">
              <div className="icon-business">
                <PeopleAltOutlinedIcon className="icon-business-icon" />
                <div className="txt-number">
                  <p className="number-index">2,245,341</p>
                  <p className="number-desc">Thành viên</p>
                </div>
              </div>
              <div className="icon-business">
                <PlayCircleOutlinedIcon className="icon-business-icon" />
                <div className="txt-number">
                  <p className="number-index">2,245,341</p>
                  <p className="number-desc">Sự kiện</p>
                </div>
              </div>
            </div>

            <div className="icon-outline">
              <div className="icon-business">
                <PublicOutlinedIcon className="icon-business-icon" />
                <div className="txt-number">
                  <p className="number-index">2,245,341</p>
                  <p className="number-desc">Câu lạc bộ</p>
                </div>
              </div>
              <div className="icon-business">
                <CreditScoreOutlinedIcon className="icon-business-icon" />
                <div className="txt-number">
                  <p className="number-index">2,245,341</p>
                  <p className="number-desc">Thanh toán</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="client-organization">
          <div className="item-organization">
            <div className="item-img">
              <img src={ImgOrganization} alt="" className="img-organization" />
            </div>
            <div className="txt-organization">
              <p className="txt-organization-desc">
                Những điều chưa được biết khi đến với
                <br /> Tech Global
              </p>
              <p className="txt-desc-organization">
                Phần mềm Chuyên viên Phân tích là giải pháp hỗ trợ toàn diện cho
                việc thu thập, xử lý và phân tích dữ liệu một cách nhanh chóng
                và chính xác. Phần mềm giúp chuyên viên dễ dàng theo dõi, đánh
                giá và trực quan hóa thông tin, từ đó đưa ra các quyết định kịp
                thời và hiệu quả. Với giao diện thân thiện, khả năng tùy chỉnh
                linh hoạt và hệ thống báo cáo thông minh, phần mềm đáp ứng tốt
                nhu cầu phân tích trong nhiều lĩnh vực, góp phần nâng cao năng
                suất làm việc và chất lượng quản lý.
              </p>
              <button className="btn-more">Xem thêm</button>
            </div>
          </div>
        </div>
        <div className="caring-marketing">
          <p className="txt-title">Thông tin thị trường</p>
          <p className="txt-desc">
            Hãy cùng khám phá những bài viết phân tích mới nhất của chúng tôi về
            thị trường chứng khoán, nơi cập nhật các xu hướng, nhận định và
            chiến lược đầu tư giúp bạn đưa ra quyết định hiệu quả hơn. Dù bạn là
            nhà đầu tư mới hay đã có kinh nghiệm, đang tìm kiếm cơ hội sinh lời,
            quản lý rủi ro hay nắm bắt diễn biến thị trường, nội dung của chúng
            tôi đều được thiết kế để hỗ trợ bạn. Hãy đồng hành cùng chúng tôi
            trên hành trình theo dõi thị trường, phân tích cơ hội và hướng tới
            đầu tư bền vững, thành công.
          </p>
          <div className="list-blog">
            {posts.length > 0 ? (
              posts.slice(0, 4).map((post, index) => (
                <div className="blog-item" key={post.id || index}>
                  <img
                    src={post.image || stock}
                    alt={post.title}
                    className="img-blog"
                  />
                  <div
                    className="blog-content"
                    onClick={() =>
                      post.id && navigate(`/blog-detail/${post.id}`)
                    }
                  >
                    <p className="txt-blog-title">{post.title}</p>
                    <div className="blog-more">
                      <p className="txt-more">Xem thêm</p>
                      <ArrowRightAltIcon className="icon-more" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="txt-desc">Chưa có bài viết nào.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeComponent;
