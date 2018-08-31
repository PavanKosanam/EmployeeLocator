namespace EmployeeLocatorDataAccess
{
    public class PathModel
    {
        public MapPoint From { get; set; }
        public MapPoint To { get; set; }
    }

    public class MapPoint
    {
        public int Width { get; set; }
        public int Height { get; set; }
    }
}
